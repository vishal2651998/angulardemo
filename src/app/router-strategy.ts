import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouterModule,
  Routes,
  UrlSegment,
} from '@angular/router';
import { pageTitle, RouterText } from './common/constant/constant';
  
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  storedHandles: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.reuseRoute || false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const id = this.createIdentifier(route);
    if (route.data.reuseRoute) {
      this.storedHandles[id] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const id = this.createIdentifier(route);
    const handle = this.storedHandles[id];
    const canAttach = !!route.routeConfig && !!handle;
    let curl = id.substring(id.indexOf('-')+1)
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == curl);
    let chkLoad: any;
    if(routeLoadIndex >= 0) {
      let routeText = pageTitle[routeLoadIndex].routerText;
      //console.log(routeText)
      chkLoad = localStorage.getItem(routeText);
      setTimeout(() => {
        localStorage.removeItem(routeText);
      }, 50);
    }
    if(chkLoad) {
      return false;
    }
    return canAttach;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const id = this.createIdentifier(route);
    if (!route.routeConfig || !this.storedHandles[id]) return null;
    return this.storedHandles[id];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private createIdentifier(route: ActivatedRouteSnapshot) {
    // Build the complete path from the root to the input route
    const segments: UrlSegment[][] = route.pathFromRoot.map(r => r.url);
    const subpaths = ([] as UrlSegment[]).concat(...segments).map(segment => segment.path);
    // Result: ${route_depth}-${path}
    return segments.length + '-' + subpaths.join('/');
  }    
}
  