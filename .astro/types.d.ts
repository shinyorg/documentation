declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S | ((context: SchemaContext) => S);
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	const entryMap: {
		"blog": {
"index.mdx": {
  id: "index.mdx",
  slug: "index",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] },
"v3.mdx": {
  id: "v3.mdx",
  slug: "v3",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] },
},
"client": {
"appbuilder.mdx": {
  id: "appbuilder.mdx",
  slug: "appbuilder",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"architecture.mdx": {
  id: "architecture.mdx",
  slug: "architecture",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"beacons/monitoring.mdx": {
  id: "beacons/monitoring.mdx",
  slug: "beacons/monitoring",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"beacons/ranging.md": {
  id: "beacons/ranging.md",
  slug: "beacons/ranging",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/background.md": {
  id: "ble/background.md",
  slug: "ble/background",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/best-practices.md": {
  id: "ble/best-practices.md",
  slug: "ble/best-practices",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/faq.mdx": {
  id: "ble/faq.mdx",
  slug: "ble/faq",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"ble/gatt.md": {
  id: "ble/gatt.md",
  slug: "ble/gatt",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/index.md": {
  id: "ble/index.md",
  slug: "ble",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/peripheral.md": {
  id: "ble/peripheral.md",
  slug: "ble/peripheral",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"ble/scanning.md": {
  id: "ble/scanning.md",
  slug: "ble/scanning",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"blehosting/advertising.md": {
  id: "blehosting/advertising.md",
  slug: "blehosting/advertising",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"blehosting/gatt.md": {
  id: "blehosting/gatt.md",
  slug: "blehosting/gatt",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"blehosting/index.md": {
  id: "blehosting/index.md",
  slug: "blehosting",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"httptransfers/advanced.md": {
  id: "httptransfers/advanced.md",
  slug: "httptransfers/advanced",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"httptransfers/index.mdx": {
  id: "httptransfers/index.mdx",
  slug: "httptransfers",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"index.mdx": {
  id: "index.mdx",
  slug: "index",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"jobs/create.md": {
  id: "jobs/create.md",
  slug: "jobs/create",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"jobs/faq.mdx": {
  id: "jobs/faq.mdx",
  slug: "jobs/faq",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"jobs/functions.md": {
  id: "jobs/functions.md",
  slug: "jobs/functions",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"jobs/index.md": {
  id: "jobs/index.md",
  slug: "jobs",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"locations/geofencing.md": {
  id: "locations/geofencing.md",
  slug: "locations/geofencing",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"locations/gps.mdx": {
  id: "locations/gps.mdx",
  slug: "locations/gps",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"notifications/channels.md": {
  id: "notifications/channels.md",
  slug: "notifications/channels",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"notifications/index.mdx": {
  id: "notifications/index.mdx",
  slug: "notifications",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"notifications/platformspecific.md": {
  id: "notifications/platformspecific.md",
  slug: "notifications/platformspecific",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"other/androidforeground.mdx": {
  id: "other/androidforeground.mdx",
  slug: "other/androidforeground",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"other/configuration.mdx": {
  id: "other/configuration.mdx",
  slug: "other/configuration",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"other/lifecyclehooks.mdx": {
  id: "other/lifecyclehooks.mdx",
  slug: "other/lifecyclehooks",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"other/persistentstorage.mdx": {
  id: "other/persistentstorage.mdx",
  slug: "other/persistentstorage",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"other/speechrecognition.mdx": {
  id: "other/speechrecognition.mdx",
  slug: "other/speechrecognition",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"other/startupservices.mdx": {
  id: "other/startupservices.mdx",
  slug: "other/startupservices",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"push/azure.md": {
  id: "push/azure.md",
  slug: "push/azure",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"push/faq.mdx": {
  id: "push/faq.mdx",
  slug: "push/faq",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"push/firebase.md": {
  id: "push/firebase.md",
  slug: "push/firebase",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
"push/index.mdx": {
  id: "push/index.mdx",
  slug: "push",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".mdx"] },
"push/native.md": {
  id: "push/native.md",
  slug: "push/native",
  body: string,
  collection: "client",
  data: InferEntrySchema<"client">
} & { render(): Render[".md"] },
},
"releases": {
"client/30.mdx": {
  id: "client/30.mdx",
  slug: "client/30",
  body: string,
  collection: "releases",
  data: InferEntrySchema<"releases">
} & { render(): Render[".mdx"] },
"index.md": {
  id: "index.md",
  slug: "index",
  body: string,
  collection: "releases",
  data: InferEntrySchema<"releases">
} & { render(): Render[".md"] },
"server/20.mdx": {
  id: "server/20.mdx",
  slug: "server/20",
  body: string,
  collection: "releases",
  data: InferEntrySchema<"releases">
} & { render(): Render[".mdx"] },
},
"server": {
"email.mdx": {
  id: "email.mdx",
  slug: "email",
  body: string,
  collection: "server",
  data: InferEntrySchema<"server">
} & { render(): Render[".mdx"] },
"index.md": {
  id: "index.md",
  slug: "index",
  body: string,
  collection: "server",
  data: InferEntrySchema<"server">
} & { render(): Render[".md"] },
"localization.md": {
  id: "localization.md",
  slug: "localization",
  body: string,
  collection: "server",
  data: InferEntrySchema<"server">
} & { render(): Render[".md"] },
"push.mdx": {
  id: "push.mdx",
  slug: "push",
  body: string,
  collection: "server",
  data: InferEntrySchema<"server">
} & { render(): Render[".mdx"] },
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
