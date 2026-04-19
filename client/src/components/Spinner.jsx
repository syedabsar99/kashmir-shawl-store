/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

export default function Spinner({ size = 40 }) {
  return (
    <div className="page-loading">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}
