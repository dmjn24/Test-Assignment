import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="relative w-16 h-16">

                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>

                <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

                <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;
