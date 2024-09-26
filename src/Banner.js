import React from 'react';
import "./Banner.css";

function Banner() {
  return <header className='banner' style={{
    backgroundSize: "cover",
    backgroundImage: `url("https://tinyurl.com/netflixbanner")`,
    backgroundPosition: "center center",
  }}>

    <div className="banner_contents">
        <h1 className="banner_title">Movie Name
        </h1>
        <div className="banner_buttons">
            <button className="banner_button">Play</button>
            <button className="banner_button">My List</button>
        </div>
    </div>
  </header>;
}

export default Banner