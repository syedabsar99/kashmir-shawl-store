/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import React from 'react';
import useSettingsStore from '../store/settingsStore';
import './Preloader.css';

export default function Preloader() {
  const { isInitialized, logoUrl, logoMain } = useSettingsStore();

  return (
    <div className="luxury-preloader">
      <div className="preloader-content">
        {!isInitialized ? (
          <>
            <svg className="preloader-svg" viewBox="0 0 100 100">
              <circle className="preloader-circle outer" cx="50" cy="50" r="46" />
              <circle className="preloader-circle inner" cx="50" cy="50" r="34" />
            </svg>
            <div className="preloader-subtext">Awakening the Loom...</div>
          </>
        ) : (
          <div className="preloader-dynamic-logo-wrapper">
            {logoUrl ? (
              <img src={logoUrl} alt={logoMain || 'Store Logo'} className="preloader-dynamic-img" />
            ) : (
              <h1 className="preloader-dynamic-text">{logoMain}</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
