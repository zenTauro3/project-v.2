import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { resend, verify, checkKey, checkAccess } from "../services/verify";
import { VerifySuccess } from "../components/Success";
import { VerifyError } from "../components/Errors";
import Loader from "../components/Loader";

function Verify() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [time, setTime] = useState(60);
    const [state, setState] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const access = query.get("access") || "";
    const ref = useRef<Array<any>>([]);

    useEffect(() => {
        checkAccess(access)
            .then(email => setEmail(email))
            .catch(() => navigate("/auth/login"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setTime(prev => prev - 1), 1000);
        if (time === 0) { clearInterval(interval); setState(false) }
        return () => clearInterval(interval);
    }, [time])

    const handleResend = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        resend(access)
            .then(() => { setTime(60); setState(true) })
            .catch(error => setError(error.response.data))
    };

    const handleVerify = (newCode: string[]) => {
        const code = newCode.join("");
        verify(code, access)
            .then(key => navigate(`/auth/verify/${key}`))
            .catch(error => {
                setCode(["", "", "", "", "", ""]);
                setError(error.response.data);
                ref.current[0].focus();
            })
    }

    const handleNumber = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = event.key;
        const validate = /^\d$/.test(key);
        const newCode = [...code];

        if (key === "Backspace") {
            newCode[index] = "";
            setCode(newCode)
            if (index !== 0) {
                ref.current[index - 1].focus();
            }
        } else if (validate) {
            newCode[index] = key;
            setCode(newCode);
            if (index < 5) ref.current[index + 1].focus();
            if (index === 5) handleVerify(newCode)
        }
    };

    if (loading) {
        return <Loader />
    } else {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <div className="bg-white p-8 rounded drop-shadow-xl text-center">
                    <div className="mb-4 text-left">
                        <Link to="/auth/register" className="text-blue-500">&#8617; Return</Link>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Email verification</h1>
                    <div className="mb-4">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                onKeyDown={(e) => handleNumber(e, index)}
                                onChange={() => { }}
                                value={value}
                                className={`w-12 h-12 mx-2 border-2 border-black text-2xl rounded-lg px-2 text-center
                                ${error && 'border-red-500 outline-red-500 transition duration-150 animate-shake'}`}
                                ref={(e) => ref.current[index] = e}
                            />
                        ))}
                    </div>
                    <div className="mb-4">
                        <span className="text-red-500 text-md">{error}</span>
                    </div>
                    <div>
                        <span className="text-lg">
                            We have sent a verification to {email} (ckeck spam)
                        </span>
                    </div>
                    <div>
                        <span className="text-lg">If you don't receive it, try </span>
                        <button disabled={state} onClick={handleResend} className="disabled:text-blue-300 font-semibold text-lg text-blue-500">resend</button>
                        <span className="text-md"> {time}</span>
                    </div>
                </div>
            </div>
        )
    }
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
export default Verify;