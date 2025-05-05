import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "Celebrating Mrs. Tejinder Kaur Mundra's PR";

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = "You're invited to celebrate Mrs. Tejinder Kaur Mundra's PR milestone! Join us for an evening of joy and celebration.";
document.head.appendChild(metaDescription);

// Add font link
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
