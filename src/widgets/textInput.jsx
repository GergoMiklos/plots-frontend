import React from 'react';

function TextInput({ value, label, onChange }) {
    console.log('TEXT_INPUT value', value)

    return (
            <div className="m-3 rounded-xl shadow bg-white p-5 max-w-3xl">
                <div>
                    <span className="text-gray-700">{ label }</span>
                    <input type="text" value={value} onChange={event => onChange({ value: event.target.value })} className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-neutral-100
                    border-transparent
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                    "/>
                </div>
            </div>
    );
}

export default TextInput;