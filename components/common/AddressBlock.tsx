import Chip from "@mui/material/Chip";

type AddressBlockProps = {
    label: string;
    address: string;
};

function AddressBlock({ label, address }: AddressBlockProps) {
    return (
        <>
            <div style={{ fontSize: 16, padding: 3 }}>{label}</div>
            <div style={{ padding: 5 }}>
                <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Chip
                        label={`${address?.slice(0, 10)}...${address?.slice(32, 42)}`}
                        variant="outlined"
                        sx={{
                            cursor: "pointer",
                            borderRadius: "4px",
                            fontFamily: "JetBrains Mono, monospace",
                        }}
                    />
                </a>
            </div>
        </>
    );
}

export default AddressBlock;
