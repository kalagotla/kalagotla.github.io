/**
 * Dynamic Recent Work Loader
 * Fetches project data from JSON and dynamically generates the Recent Work section
 */

(function() {
  'use strict';

  const RECENT_WORK_CONTAINER_ID = 'recent-work-container';
  const PROJECTS_DATA_URL = '/assets/data/projects.json';

  /**
   * Generate HTML for a single work item
   */
  function createWorkItemHTML(project) {
    const imageHTML = project.image 
      ? `<div class="work-item-image-wrapper">
           <div class="work-item-image">
             <img src="${project.image}" alt="${project.title}" loading="lazy" />
           </div>
         </div>`
      : '';

    // Build links HTML - prioritize projectPage, then github, then research page
    let linksHTML = '';
    if (project.links) {
      if (project.links.projectPage) {
        linksHTML = `<a href="${project.links.projectPage}" class="work-link">Learn More →</a>`;
      } else if (project.links.github) {
        linksHTML = `<a href="${project.links.github}" class="work-link" target="_blank" rel="noopener">View on GitHub →</a>`;
      } else if (project.links.paper) {
        linksHTML = `<a href="${project.links.paper}" class="work-link" target="_blank" rel="noopener">View Paper →</a>`;
      } else {
        linksHTML = `<a href="research.html" class="work-link">Learn More →</a>`;
      }
    } else {
      linksHTML = '<a href="research.html" class="work-link">Learn More →</a>';
    }

    return `
      <div class="work-item" data-project-id="${project.id}">
        ${imageHTML}
        <h4>${project.title}</h4>
        ${project.meta ? `<div class="work-item-meta">${project.meta}</div>` : ''}
        <p>${project.description}</p>
        ${linksHTML}
      </div>
    `;
  }

  /**
   * Render work items with fade-in animation
   */
  function renderWorkItems(projects, container) {
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

    // Generate HTML for all items
    const itemsHTML = sortedProjects.map(project => createWorkItemHTML(project)).join('');

    // Insert HTML
    container.innerHTML = itemsHTML;

    // Add fade-in animation with staggered delays (only if items were inserted)
    requestAnimationFrame(() => {
      const workItems = container.querySelectorAll('.work-item');
      if (workItems.length > 0) {
        workItems.forEach((item, index) => {
          // Set initial state for animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          // Animate in with stagger
          setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 150); // Stagger animation by 150ms per item
        });
      }
    });
  }

  /**
   * Load and display featured projects
   */
  function loadRecentWork() {
    const container = document.getElementById(RECENT_WORK_CONTAINER_ID);
    
    if (!container) {
      console.warn('Recent work container not found');
      return;
    }

    // Show loading state
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Loading recent work...</p>';

    // Fetch projects data
    fetch(PROJECTS_DATA_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Filter featured projects
        const featuredProjects = data.filter(project => project.featured === true);
        
        // Render work items
        renderWorkItems(featuredProjects, container);
      })
      .catch(error => {
        console.error('Error loading recent work:', error);
        // Fallback: show static content
        container.innerHTML = `
          <div class="work-item">
            <h4>BICSNet</h4>
            <p>Physics-aware neural network for shock wave detection and analysis in supersonic flows.</p>
            <a href="research.html" class="work-link">Learn More →</a>
          </div>
          <div class="work-item">
            <h4>lptlib</h4>
            <p>Open-source library for Lagrangian particle tracking and analysis in fluid dynamics.</p>
            <a href="https://github.com/kalagotla/lptlib" target="_blank" class="work-link">View on GitHub →</a>
          </div>
          <div class="work-item">
            <h4>Research</h4>
            <p>Explore my research philosophy, projects, and publications in computational fluid dynamics and machine learning.</p>
            <a href="research.html" class="work-link">View Research →</a>
          </div>
        `;
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRecentWork);
  } else {
    // DOM is already ready
    loadRecentWork();
  }
})();

