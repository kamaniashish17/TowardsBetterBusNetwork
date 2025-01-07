import React from 'react';
import iconPath from '../../images/admin-panel.png'
const ControlBar = ({onClickHeatMapButton,
                    onClickEnhancementButton,
                    onClickOptimalRoute}) => {
    return (
        <div
            className="flex flex-col justify-center items-center w-1/6 h-[600px] p-4"> {/* Fixed missing closing bracket */}
            <img src={iconPath} alt="Duration Icon" className="w-24 h-24 mb-10 mx-auto"/>
            <button
                className="w-full py-4 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                onClick={onClickEnhancementButton}
            >
                Duration Analysis
            </button>

            <button
                className="w-full py-4 mt-12 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                onClick={onClickHeatMapButton}
            >
                Route Level Analysis
            </button>

            <button
                className="w-full py-4 mt-12 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                onClick={onClickOptimalRoute}
            >
                Find Optimal Route
            </button>
        </div>

    );
};

export default ControlBar;
