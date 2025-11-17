/**
 * Dynamic Research Projects Loader
 * Fetches project data from JSON and dynamically generates the Selected Projects section on research.html
 */

(function() {
  'use strict';

  const PROJECTS_CONTAINER_ID = 'research-projects-container';
  const PROJECTS_DATA_URL = '/assets/data/projects.json';

  /**
   * Generate HTML for a single project card (matching research.html structure)
   */
  function createProjectCardHTML(project) {
    const imageHTML = project.image 
      ? `<div class="project-image">
           <img src="${project.image}" alt="${project.title}" />
         </div>`
      : '';

    // Build project links HTML
    let linksHTML = '';
    if (project.links) {
      const links = [];
      
      if (project.links.projectPage) {
        links.push(`<a href="${project.links.projectPage}" class="project-link" target="_blank">
          <i class="fas fa-external-link-alt"></i>
          Project Page
        </a>`);
      }
      
      if (project.links.github) {
        links.push(`<a href="${project.links.github}" class="project-link" target="_blank">
          <i class="fab fa-github"></i>
          GitHub
        </a>`);
      }
      
      if (project.links.paper) {
        links.push(`<a href="${project.links.paper}" class="project-link" target="_blank">
          <i class="fas fa-file-alt"></i>
          ${project.links.paper.includes('doi.org') ? 'Paper' : 'View Paper'}
        </a>`);
      }
      
      if (project.links.pypi) {
        links.push(`<a href="${project.links.pypi}" class="project-link" target="_blank">
          <i class="fab fa-python"></i>
          PyPI
        </a>`);
      }
      
      if (links.length > 0) {
        linksHTML = `<div class="project-links">${links.join('')}</div>`;
      }
    }

    return `
      <div class="project">
        <div class="project-card">
          ${imageHTML}
          <div class="project-content">
            <h3>${project.title}</h3>
            ${project.meta ? `<div class="project-meta">${project.meta}</div>` : ''}
            <p class="project-description">${project.description}</p>
            ${linksHTML}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render projects with fade-in animation
   */
  function renderProjects(projects, container) {
    if (!projects || projects.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No featured projects available.</p>';
      return;
    }

    // Sort by order if present
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });

    // Generate HTML for all projects
    const projectsHTML = sortedProjects.map(project => createProjectCardHTML(project)).join('');

    // Insert HTML
    container.innerHTML = projectsHTML;

    // Add fade-in animation with staggered delays
    requestAnimationFrame(() => {
      const projectItems = container.querySelectorAll('.project');
      if (projectItems.length > 0) {
        projectItems.forEach((item, index) => {
          // Set initial state for animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          // Animate in with stagger
          setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 100); // Stagger animation by 100ms per item
        });
      }
    });
  }

  /**
   * Load and display featured projects
   */
  function loadResearchProjects() {
    const container = document.getElementById(PROJECTS_CONTAINER_ID);
    
    if (!container) {
      console.warn('Research projects container not found');
      return;
    }

    // Show loading state
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Loading projects...</p>';

    // Fetch projects data
    fetch(PROJECTS_DATA_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Filter featured projects (or show all if no featured filter exists)
        const featuredProjects = data.filter(project => project.featured === true);
        
        // Render projects
        renderProjects(featuredProjects, container);
      })
      .catch(error => {
        console.error('Error loading research projects:', error);
        // Fallback: show error message
        container.innerHTML = `
          <p style="color: var(--text-muted); text-align: center; padding: 2rem;">
            Unable to load projects. Please try refreshing the page.
          </p>
        `;
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadResearchProjects);
  } else {
    // DOM is already ready
    loadResearchProjects();
  }
})();

