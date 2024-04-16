import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageItem, PlatFormType } from 'src/app/common/constant/constant';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  availableThemes: any = { ...environment.theme };
  private active: Theme = environment.theme.cba;

  constructor() {
  }

  getAvailableThemes() {
    return this.availableThemes;
  }

  async setTheme(theme: Theme = this.active) {
    await fetch(theme.path).then(res => res.json()).then((themeJson: {}) => {
      this.setThemeJSON(themeJson);
      localStorage.setItem(LocalStorageItem.themeJSON, JSON.stringify(themeJson))
      this.setActiveTheme(theme);
    })
  }

  async setThemeJSON(json) {
    Object.keys(json).forEach(property => {
      document.documentElement.style.setProperty(property, json[property]);
    });
  }

  setActiveTheme(theme: Theme) {
    this.active = theme;
    localStorage.setItem(LocalStorageItem.activeTheme, JSON.stringify(theme))
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  attachTheme(platformId) {
    let themeJson
    // themeJson = localStorage.getItem(LocalStorageItem.themeJSON);
    const activeTheme = localStorage.getItem(LocalStorageItem.activeTheme);
    if (!themeJson) {
      switch (platformId) {
        case PlatFormType.Collabtic:
          this.setTheme(this.availableThemes.default);
          break;
        case PlatFormType.CbaForum:
          this.setTheme(this.availableThemes.cba);
          break;
        default:
          this.setTheme(this.availableThemes.default);
          break;
      }
    } else if (themeJson) {
      if (!activeTheme) {
        switch (platformId) {
          case PlatFormType.Collabtic:
            this.setActiveTheme(this.availableThemes.default);
            break;
          case PlatFormType.CbaForum:
            this.setActiveTheme(this.availableThemes.cba);
            break;
          default:
            this.setActiveTheme(this.availableThemes.default);
            break;
        }
      }
      this.setThemeJSON(JSON.parse(themeJson));
    }
  }
}


export interface Theme {
  name: string;
  path: any;
}