/**
 * Lightweight preprocessor that replicates the dotnet template engine's
 * conditional directives in JavaScript.
 *
 * Handles:
 * - C-style: #if / #elif / #else / #endif (in .cs files)
 * - XML-style: <!--#if / <!--#elif / <!--#else / <!--#endif (in .csproj, .xml, .xcprivacy)
 * - Razor-style: @*#if / @*#else / @*#elseif / #endif*@ (in .razor files)
 * - CND markers: //-:cnd:noEmit / //+:cnd:noEmit toggle real C# #if vs template conditionals
 */

type Symbols = Record<string, boolean | string>;

/**
 * Process a template file, evaluating conditional directives and performing
 * string replacements.
 */
export function processTemplate(
    content: string,
    symbols: Symbols,
    replacements: Record<string, string>,
    fileExtension: string
): string {
    // First apply string replacements
    let result = content;
    for (const [search, replace] of Object.entries(replacements)) {
        result = result.split(search).join(replace);
    }

    // Then process conditionals based on file type
    if (fileExtension === '.razor') {
        result = processRazorConditionals(result, symbols);
    } else if (['.csproj', '.xml', '.xcprivacy', '.plist', '.xaml'].includes(fileExtension)) {
        result = processXmlConditionals(result, symbols);
        // Some XML files also have C-style conditionals in comments
        result = processCStyleConditionals(result, symbols);
    } else {
        result = processCStyleConditionals(result, symbols);
    }

    // Clean up multiple consecutive blank lines
    result = result.replace(/\n{3,}/g, '\n\n');

    return result;
}

/**
 * Process C-style #if/#elif/#else/#endif directives.
 * Handles CND markers (//-:cnd:noEmit / //+:cnd:noEmit) that mark sections
 * where #if directives are real C# platform conditionals (not template ones).
 */
function processCStyleConditionals(content: string, symbols: Symbols): string {
    const lines = content.split('\n');
    const output: string[] = [];

    // Track CND state: when cndEmit is false, #if directives are template conditionals
    // when cndEmit is true, they are real C# directives that should pass through
    let cndEmit = false;

    // Stack for nested conditionals
    interface CondState {
        active: boolean;       // Is this branch currently outputting?
        resolved: boolean;     // Has any branch in this if/elif/else chain been true?
        isCnd: boolean;        // Is this a CND (real C#) conditional?
    }
    const stack: CondState[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // CND markers
        if (trimmed === '//-:cnd:noEmit') {
            cndEmit = true;
            continue;
        }
        if (trimmed === '//+:cnd:noEmit') {
            cndEmit = false;
            continue;
        }

        // Check if we're currently outputting (all parent scopes are active)
        const parentActive = stack.length === 0 || stack.every(s => s.active);

        // #if directive
        const ifMatch = trimmed.match(/^#if\s+(.+)$/);
        if (ifMatch) {
            if (cndEmit) {
                // Real C# #if — pass through and push a CND state
                stack.push({ active: true, resolved: true, isCnd: true });
                if (parentActive) output.push(line);
            } else {
                const condition = ifMatch[1];
                const result = evaluateCondition(condition, symbols);
                stack.push({ active: result && parentActive, resolved: result, isCnd: false });
            }
            continue;
        }

        // #elif directive
        const elifMatch = trimmed.match(/^#elif\s+(.+)$/);
        if (elifMatch && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.isCnd) {
                if (parentActive) output.push(line);
            } else {
                if (top.resolved) {
                    top.active = false;
                } else {
                    const result = evaluateCondition(elifMatch[1], symbols);
                    top.active = result && (stack.length <= 1 || stack.slice(0, -1).every(s => s.active));
                    top.resolved = result;
                }
            }
            continue;
        }

        // #else directive
        if (trimmed === '#else' && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.isCnd) {
                if (parentActive) output.push(line);
            } else {
                top.active = !top.resolved && (stack.length <= 1 || stack.slice(0, -1).every(s => s.active));
            }
            continue;
        }

        // #endif directive
        if (trimmed === '#endif' && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.isCnd) {
                if (parentActive) output.push(line);
            }
            stack.pop();
            continue;
        }

        // Regular line — output if active
        if (stack.length === 0 || stack.every(s => s.active)) {
            output.push(line);
        }
    }

    return output.join('\n');
}

/**
 * Process XML-style <!--#if-->...<!--#endif--> directives.
 */
function processXmlConditionals(content: string, symbols: Symbols): string {
    const lines = content.split('\n');
    const output: string[] = [];

    interface CondState {
        active: boolean;
        resolved: boolean;
    }
    const stack: CondState[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // <!--#if (condition)-->
        const ifMatch = trimmed.match(/^<!--\s*#if\s+(.+?)-->$/);
        if (ifMatch) {
            const parentActive = stack.length === 0 || stack.every(s => s.active);
            const result = evaluateCondition(ifMatch[1], symbols);
            stack.push({ active: result && parentActive, resolved: result });
            continue;
        }

        // <!--#elif (condition)--> or <!--#elseif-->
        const elifMatch = trimmed.match(/^<!--\s*#(?:elif|elseif)\s+(.+?)-->$/);
        if (elifMatch && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.resolved) {
                top.active = false;
            } else {
                const parentActive = stack.length <= 1 || stack.slice(0, -1).every(s => s.active);
                const result = evaluateCondition(elifMatch[1], symbols);
                top.active = result && parentActive;
                top.resolved = result;
            }
            continue;
        }

        // <!--#else-->
        if (trimmed.match(/^<!--\s*#else\s*-->$/)) {
            if (stack.length > 0) {
                const top = stack[stack.length - 1];
                const parentActive = stack.length <= 1 || stack.slice(0, -1).every(s => s.active);
                top.active = !top.resolved && parentActive;
            }
            continue;
        }

        // <!--#endif-->
        if (trimmed.match(/^<!--\s*#endif\s*-->$/)) {
            stack.pop();
            continue;
        }

        // Regular line
        if (stack.length === 0 || stack.every(s => s.active)) {
            output.push(line);
        }
    }

    return output.join('\n');
}

/**
 * Process Razor-style @*#if / #endif*@ directives.
 */
function processRazorConditionals(content: string, symbols: Symbols): string {
    const lines = content.split('\n');
    const output: string[] = [];

    interface CondState {
        active: boolean;
        resolved: boolean;
    }
    const stack: CondState[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // @*#if (condition)
        const ifMatch = trimmed.match(/^@\*#if\s+(.+)$/);
        if (ifMatch) {
            const parentActive = stack.length === 0 || stack.every(s => s.active);
            const result = evaluateCondition(ifMatch[1], symbols);
            stack.push({ active: result && parentActive, resolved: result });
            continue;
        }

        // @*#else
        if (trimmed.match(/^@\*#else$/)) {
            if (stack.length > 0) {
                const top = stack[stack.length - 1];
                const parentActive = stack.length <= 1 || stack.slice(0, -1).every(s => s.active);
                top.active = !top.resolved && parentActive;
            }
            continue;
        }

        // @*#elseif (condition)
        const elifMatch = trimmed.match(/^@\*#elseif\s+(.+)$/);
        if (elifMatch && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.resolved) {
                top.active = false;
            } else {
                const parentActive = stack.length <= 1 || stack.slice(0, -1).every(s => s.active);
                const result = evaluateCondition(elifMatch[1], symbols);
                top.active = result && parentActive;
                top.resolved = result;
            }
            continue;
        }

        // #endif*@
        if (trimmed.match(/#endif\*@$/)) {
            stack.pop();
            continue;
        }

        // Regular line
        if (stack.length === 0 || stack.every(s => s.active)) {
            output.push(line);
        }
    }

    return output.join('\n');
}

/**
 * Evaluate a template condition expression.
 * Supports: symbol, !symbol, (symbol), symbol == "value", symbol != "value",
 * symbol || symbol, symbol && symbol, and combinations with parens.
 */
export function evaluateCondition(expr: string, symbols: Symbols): boolean {
    // Strip outer parens if they wrap the entire expression
    let e = expr.trim();
    if (e.startsWith('(') && e.endsWith(')') && isBalancedParens(e)) {
        e = e.slice(1, -1).trim();
    }

    // Handle || (lowest precedence)
    const orParts = splitOnOperator(e, '||');
    if (orParts.length > 1) {
        return orParts.some(part => evaluateCondition(part, symbols));
    }

    // Handle &&
    const andParts = splitOnOperator(e, '&&');
    if (andParts.length > 1) {
        return andParts.every(part => evaluateCondition(part, symbols));
    }

    // Handle == comparison
    const eqMatch = e.match(/^(\w+)\s*={2,3}\s*"([^"]*)"$/);
    if (eqMatch) {
        const val = symbols[eqMatch[1]];
        return String(val ?? '') === eqMatch[2];
    }

    // Handle != comparison
    const neqMatch = e.match(/^(\w+)\s*!==?\s*"([^"]*)"$/);
    if (neqMatch) {
        const val = symbols[neqMatch[1]];
        return String(val ?? '') !== neqMatch[2];
    }

    // Handle == for non-string comparisons
    const eqBoolMatch = e.match(/^(\w+)\s*={2,3}\s*(true|false)$/i);
    if (eqBoolMatch) {
        const val = symbols[eqBoolMatch[1]];
        const expected = eqBoolMatch[2].toLowerCase() === 'true';
        return !!val === expected;
    }

    // Handle negation
    if (e.startsWith('!')) {
        return !evaluateCondition(e.slice(1), symbols);
    }

    // Handle sub-expression in parens
    if (e.startsWith('(') && e.endsWith(')')) {
        return evaluateCondition(e.slice(1, -1), symbols);
    }

    // Simple symbol lookup — truthy check
    const val = symbols[e.trim()];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val !== '' && val !== 'false' && val !== 'None';
    return false;
}

function isBalancedParens(s: string): boolean {
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') depth++;
        if (s[i] === ')') depth--;
        if (depth === 0 && i < s.length - 1) return false;
    }
    return depth === 0;
}

function splitOnOperator(expr: string, op: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    let inString = false;

    for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];
        if (ch === '"') inString = !inString;
        if (!inString) {
            if (ch === '(') depth++;
            if (ch === ')') depth--;
            if (depth === 0 && expr.substring(i, i + op.length) === op) {
                parts.push(current.trim());
                current = '';
                i += op.length - 1;
                continue;
            }
        }
        current += ch;
    }
    parts.push(current.trim());
    return parts;
}

/**
 * Evaluate an exclusion condition from template.json modifiers.
 * These use a slightly different syntax with == and === operators.
 */
export function evaluateExclusionCondition(condition: string, symbols: Symbols): boolean {
    return evaluateCondition(condition, symbols);
}
