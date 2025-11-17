/**
 * Research Areas Interactive Module
 * Handles clicking on research area boxes to show relevant projects
 */

(function() {
  'use strict';

  const PROJECTS_DATA_URL = '/assets/data/projects.json';
  const PROJECTS_CONTAINER_ID = 'research-projects-container';
  
  let allProjects = [];
  let currentSelectedArea = null;
  let expandedProjects = new Set();

  /**
   * Initialize the module
   */
  function init() {
    loadProjects();
    setupResearchAreaClickHandlers();
  }

  /**
   * Load projects from JSON
   */
  function loadProjects() {
    fetch(PROJECTS_DATA_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        allProjects = data;
      })
      .catch(error => {
        console.error('Error loading projects:', error);
      });
  }

  /**
   * Setup click handlers for research area boxes
   */
  function setupResearchAreaClickHandlers() {
    const interestItems = document.querySelectorAll('.interest-item');
    
    interestItems.forEach(item => {
      item.addEventListener('click', function() {
        const researchArea = this.querySelector('span').textContent.trim();
        handleResearchAreaClick(researchArea, this);
      });
      
      // Add cursor pointer style
      item.style.cursor = 'pointer';
    });
  }

  /**
   * Handle click on a research area
   */
  function handleResearchAreaClick(researchArea, element) {
    // Toggle selection
    if (currentSelectedArea === researchArea) {
      // Deselect if clicking the same area
      currentSelectedArea = null;
      element.classList.remove('active');
      hideProjects();
    } else {
      // Select new area
      if (currentSelectedArea) {
        // Remove active class from previous selection
        document.querySelectorAll('.interest-item').forEach(item => {
          item.classList.remove('active');
        });
      }
      currentSelectedArea = researchArea;
      element.classList.add('active');
      showProjectsForArea(researchArea);
    }
  }

  /**
   * Filter and show projects for a research area
   */
  function showProjectsForArea(researchArea) {
    const filteredProjects = allProjects.filter(project => {
      return project.researchAreas && project.researchAreas.includes(researchArea);
    });

    if (filteredProjects.length === 0) {
      showNoProjectsMessage();
      return;
    }

    renderProjects(filteredProjects);
  }

  /**
   * Render projects in the container
   */
  function renderProjects(projects) {
    const container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) {
      console.error('Projects container not found');
      return;
    }

    // Sort projects by order if present
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });

    const projectsHTML = sortedProjects.map(project => createProjectHTML(project)).join('');
    
    container.innerHTML = projectsHTML;
    container.style.display = 'block';
    
    // Animate in
    requestAnimationFrame(() => {
      container.style.opacity = '0';
      container.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 10);
    });

    // Setup project click handlers
    setupProjectClickHandlers();
  }

  /**
   * Create HTML for a single project
   */
  function createProjectHTML(project) {
    const isExpanded = expandedProjects.has(project.id);
    const imageHTML = project.image 
      ? `<div class="research-project-image">
           <img src="${project.image}" alt="${project.title}" loading="lazy" />
         </div>`
      : '';

    const descriptionHTML = isExpanded 
      ? `<div class="research-project-description expanded">
           <p>${project.description}</p>
           ${createProjectLinksHTML(project)}
         </div>`
      : `<div class="research-project-description collapsed">
           <p>${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
         </div>`;

    return `
      <div class="research-project-item" data-project-id="${project.id}">
        ${imageHTML}
        <div class="research-project-content">
          <h4 class="research-project-title">${project.title}</h4>
          ${project.meta ? `<div class="research-project-meta">${project.meta}</div>` : ''}
          ${descriptionHTML}
          <button class="research-project-toggle" aria-label="Toggle project details">
            ${isExpanded ? 'Show Less' : 'Learn More'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Create HTML for project links
   */
  function createProjectLinksHTML(project) {
    if (!project.links) return '';

    const links = [];
    if (project.links.projectPage) {
      links.push(`<a href="${project.links.projectPage}" class="research-project-link" target="_blank">View Project Page →</a>`);
    }
    if (project.links.github) {
      links.push(`<a href="${project.links.github}" class="research-project-link" target="_blank">GitHub →</a>`);
    }
    if (project.links.paper) {
      links.push(`<a href="${project.links.paper}" class="research-project-link" target="_blank">View Paper →</a>`);
    }
    if (project.links.pypi) {
      links.push(`<a href="${project.links.pypi}" class="research-project-link" target="_blank">PyPI →</a>`);
    }

    return links.length > 0 ? `<div class="research-project-links">${links.join('')}</div>` : '';
  }

  /**
   * Setup click handlers for project items
   */
  function setupProjectClickHandlers() {
    const projectItems = document.querySelectorAll('.research-project-item');
    const toggleButtons = document.querySelectorAll('.research-project-toggle');

    toggleButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const projectItem = this.closest('.research-project-item');
        const projectId = projectItem.dataset.projectId;
        toggleProjectDetails(projectId, projectItem);
      });
    });

    // Make project items clickable to navigate to project page
    projectItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Don't navigate if clicking on toggle button or links
        if (e.target.closest('.research-project-toggle') || e.target.closest('.research-project-link')) {
          return;
        }
        
        const projectId = this.dataset.projectId;
        const project = allProjects.find(p => p.id === projectId);
        
        if (project && project.links && project.links.projectPage) {
          window.location.href = project.links.projectPage;
        }
      });
    });
  }

  /**
   * Toggle project details expansion
   */
  function toggleProjectDetails(projectId, projectItem) {
    const isExpanded = expandedProjects.has(projectId);
    const project = allProjects.find(p => p.id === projectId);
    
    if (!project) return;

    if (isExpanded) {
      expandedProjects.delete(projectId);
    } else {
      expandedProjects.add(projectId);
    }

    // Update just this project item instead of re-rendering all
    const projectContent = projectItem.querySelector('.research-project-content');
    if (projectContent) {
      const descriptionDiv = projectContent.querySelector('.research-project-description');
      const toggleButton = projectContent.querySelector('.research-project-toggle');
      
      if (descriptionDiv && toggleButton) {
        const isNowExpanded = expandedProjects.has(projectId);
        
        if (isNowExpanded) {
          // Expand: show full description and links
          descriptionDiv.className = 'research-project-description expanded';
          descriptionDiv.innerHTML = `
            <p>${project.description}</p>
            ${createProjectLinksHTML(project)}
          `;
          toggleButton.textContent = 'Show Less';
        } else {
          // Collapse: show truncated description
          descriptionDiv.className = 'research-project-description collapsed';
          descriptionDiv.innerHTML = `
            <p>${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
          `;
          toggleButton.textContent = 'Learn More';
        }
      }
    }
  }

  /**
   * Show message when no projects found
   */
  function showNoProjectsMessage() {
    const container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;

    container.innerHTML = `
      <div class="research-projects-empty">
        <p>No projects found for this research area.</p>
      </div>
    `;
    container.style.display = 'block';
  }

  /**
   * Hide projects container
   */
  function hideProjects() {
    const container = document.getElementById(PROJECTS_CONTAINER_ID);
    if (!container) return;

    container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    container.style.opacity = '0';
    container.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      container.style.display = 'none';
      container.innerHTML = '';
    }, 300);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

