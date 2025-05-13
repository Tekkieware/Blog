import React from 'react'

const Logo = () => {
    return (
        <div className="flex justify-center min-h-full gap-0.5">
            <div className="flex flex-col items-center">
                <div className="flex mb-0.5">
                    <div className="w-2 h-2 rounded-full border-[3px] border-secondary mr-0.5"></div>
                    <div className="w-2 h-2 rounded-full border-[3px] border-primary"></div>
                </div>
                <div className="flex w-5 h-6">
                    <div className="w-1/2 h-full bg-primary rounded-l-sm"></div>
                    <div className="w-1/2 h-full bg-secondary rounded-r-sm"></div>
                </div>
            </div>
        </div>
    )
}

export default Logo