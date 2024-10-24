import { Chips } from "primereact/chips";

// eslint-disable-next-line react/prop-types
const InputChip = ({ value, onChange }) => {
    return (
        <Chips
            id="tags"
            value={value}
            onChange={(e) => onChange(e.value)}
            placeholder="Add tags"
            pt={{
                container: "form-control !border-[#ebedf2] min-h-16",
                token: "border px-3 py-1.5 rounded-full min-w-16 text-base gap-x-2 mr-2",
            }}
            className="block"
            addOnBlur
        />
    );
};

export default InputChip;
