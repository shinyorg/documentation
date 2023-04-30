export interface Props {
    text: string;
    btnText?: string;
}
const CopyToClipboardButton = (props: Props) => {
    const btn = props.btnText || 'Copy to Clipboard';
    const handle = () => {
        navigator.clipboard.writeText(props.text);
    };

    return (
        <button onClick={handle}>{btn}</button>
    );
};
export default CopyToClipboardButton