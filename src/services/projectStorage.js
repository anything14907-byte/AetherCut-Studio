/**
 * Project Storage Service
 * Handles auto-save to localStorage and portable .aether.json export / import
 */

const STORAGE_KEY = 'aethercut_studio_project_v1';

export const projectStorage = {
  saveToLocalStorage(project) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      return true;
    } catch (err) {
      console.error('Failed to auto-save project to localStorage:', err);
      return false;
    }
  },

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Failed to load project from localStorage:', err);
    }
    return null;
  },

  exportProjectFile(project) {
    const filename = `${(project.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '_')}.aether.json`;
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importProjectFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.clips || !Array.isArray(parsed.clips)) {
            throw new Error('Invalid project file: missing clips array');
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }
};

