import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function Counter({ wire, ...props }) {
    const [count, setCount] = useState(1);

    const doubleCurrentCount = () => {
        wire.doubleIt(count).then((data) => {
            setCount(data);
        });
    };

    const message = props.mingleData.message;

    return (
        <div className="m-10">
            <div className="text-lg">Counter component with React</div>

            <div className="mt-8">Initial message: {message}</div>

            <div className="mt-8"></div>

            <div>
                {" "}
                Let's make the operation on the server, for demo purposes.
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Button onClick={() => setCount(1)}>Keep it (reset)</Button>
                <div> Current Count: {count} </div>

                <Button onClick={() => doubleCurrentCount()}>
                    Double it - and give it to the next person
                </Button>
            </div>
        </div>
    );
}

export default Counter;
