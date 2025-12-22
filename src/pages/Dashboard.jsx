
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { pdfToolCategories, imageToolCategories } from '../data/tools.jsx';
import ToolCard from '../components/ToolCard';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import './Dashboard.css';

const allTools = [...pdfToolCategories, ...imageToolCategories];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = allTools.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
      tool.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>All-in-One PDF & Image Tools - Free & Online</title>
        <meta name="description" content="Your one-stop solution for all your file conversion needs. Merge, split, compress, convert, and edit PDFs and images with our comprehensive suite of online tools." />
        <link rel="canonical" href={`${window.location.origin}/`} />
      </Helmet>
      <div className="dashboard-header">
        <h1>The All-in-One PDF & Image Solution</h1>
        <p>Your one-stop shop for all your file conversion needs. Merge, split, compress, and convert with ease.</p>
        <div className="search-bar-container">
          <InputGroup inside>
            <Input
              placeholder="Search for a tool..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </div>
      </div>

      {filteredTools.map(category => (
        <div key={category.title} className="tool-category-section">
          <h2>{category.title}</h2>
          <div className="tool-grid">
            {category.tools.map(tool => (
              <ToolCard key={tool.key} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
