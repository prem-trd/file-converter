
import React from 'react';
import { Link } from 'react-router-dom';
import './ToolCard.css';

const ToolCard = ({ tool }) => {
  return (
    <Link to={`/${tool.key}`} className="tool-card-link">
      <div className="tool-card">
        <div className="tool-card-icon" style={{ color: tool.color }}>
          {tool.icon}
        </div>
        <div className="tool-card-content">
          <h4 className="tool-card-title">{tool.label}</h4>
          <p className="tool-card-description">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
