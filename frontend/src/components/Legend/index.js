import React, { useEffect, useState } from 'react';
import "./Legend.css";

const Legend = (() => {
    return (
        <div id="legendContainer">
            <div id="checkInContainer">
                <div id="checkInDiv"></div><span id="checkInSpan"> Check In</span><br/>
            </div>
            <div id="checkOutContainer">
                <div id="checkOutDiv"></div><span id="checkOutSpan"> Check Out</span><br/>
            </div>
            <div id="mergedContainer">
                <div id="mergedDiv"></div><span id="mergedSpan"> Average Load</span>
            </div>
            
        </div>
    )
});

export default Legend;