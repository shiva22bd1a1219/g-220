import React from "react";

function Footer() {
  return (
    <footer className="bg-white shadow-md py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-neutral">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
