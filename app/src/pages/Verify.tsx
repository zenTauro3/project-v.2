import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { VerifySuccess } from "../components/Success";
import { VerifyError } from "../components/Errors";
import { verify, checkKey } from "../services/verify";
import Loader from "../components/Loader";

function Verify() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const access = query.get("access");
    const ref = useRef<Array<any>>([]);

    const handlePress = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = event.key;
        const number = event.currentTarget.value;

        if (key === "Backspace" && number === "" && index > 0) {
            ref.current[index - 1].focus()
        };

        if (key !== "Backspace" && number && index < 5) {
            ref.current[index + 1].focus()
        }
    }

    const handleNumber = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const number = event.target.value;
        const validate = /^\d$/.test(number);
        const newCode = [...code];
        newCode[index] = number;

        if (validate) {
            setCode(newCode);
            if (index < 5) {
                ref.current[index + 1].focus()
            } else {
                verify(newCode.join(""), access || "")
                    .then(key => navigate(`/auth/verify/${key}`))
                    .catch(error => {
                        setCode(["", "", "", "", "", ""]);
                        ref.current[0].focus();
                        setError(error.response.data);
                    })
            }
        } else {
            if (number === "") {
                setCode(newCode)
                if (index > 0) {
                    ref.current[index - 1].focus()
                }
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded drop-shadow-xl text-center">
                <div className="mb-4 text-left">
                    <Link to="/auth/register" className="text-blue-500">&#8617; Return</Link>
                </div>
                <h1 className="text-4xl font-bold mb-4">Email verification</h1>
                <div className="mb-4">
                    {code.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            onChange={(e) => handleNumber(e, index)}
                            onKeyDown={(e) => handlePress(e, index)}
                            value={value}
                            className="w-12 h-12 mx-2 border-2 border-black text-2xl rounded-lg px-2 text-center"
                            ref={(e) => ref.current[index] = e}
                        />
                    ))}
                </div>
                <span className="text-red-500 text-md">{error}</span>
                <span className="text-lg">
                    We have sent you a email verification (ckeck spam)
                </span>
            </div>
        </div>
    )
};

function Key() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const { key } = useParams();

    useEffect(() => {
        if (key) {
            checkKey(key)
                .then(() => setVerified(true))
                .catch(() => setVerified(false))
                .finally(() => setLoading(false))
        }
    }, [])

    if (loading) {
        return <Loader />
    } else {
        return verified ? <VerifySuccess /> : <VerifyError />
    }
};

export { Key };
export default Verify