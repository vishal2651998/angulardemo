import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaManagerService {

  constructor(private http: HttpClient, private apiUrl: ApiService) { }

  // Get Media Lists
  getMediaLists(mediaData) {
    let filterOptions = JSON.stringify(mediaData.filterOptions);
    //let mfilter = (mediaData.access == 'media') ? 'mediaFilter' : 'mediaUploadFilter';
    //console.log(filterOptions)
    //localStorage.setItem(mfilter, filterOptions);
    if (mediaData.accessPage == 'media') {
      localStorage.setItem('mediaFilter', filterOptions);
    } else {
      localStorage.setItem('mediaUploadFilter', filterOptions);
    }


    const params = new HttpParams()
      .set('apiKey', mediaData.apiKey)
      .set('userId', mediaData.userId)
      .set('domainId', mediaData.domainId)
      .set('countryId', mediaData.countryId)
      .set('mediaId', mediaData.mediaId)
      .set('searchKey', mediaData.searchKey)
      .set('filterOptions', filterOptions)
      .set('accessType', mediaData.accessType)
      .set('type', mediaData.type)
      .set('offset', mediaData.offset)
      .set('limit', mediaData.limit)
    const body = JSON.stringify(mediaData);

    return this.http.post<any>(this.apiUrl.apiGetMediaLists(), body, { 'params': params })
  }

  // Check Media Name
  checkMediaName(mediaData) {
    return this.http.post<any>(this.apiUrl.apiCheckMediaName(), mediaData);
  }

  // checkUploadAttachment(mediaData) {
  //   return this.http.post<any>(this.apiUrl.apiGetUploadAttachments(), mediaData);
  // }
  checkUploadAttachment(mediaData) {
    return this.http.post<any>(this.apiUrl.apiCheckUploadMedia(), mediaData);
  }
  // Get Media Lists
  getMediaDetail(mediaData) {
    const params = new HttpParams()
      .set('apiKey', mediaData.apiKey)
      .set('userId', mediaData.userId)
      .set('domainId', mediaData.domainId)
      .set('countryId', mediaData.countryId)
      .set('mediaId', mediaData.mediaId)
      .set('accessType', mediaData.accessType)
    const body = JSON.stringify(mediaData);

    return this.http.post<any>(this.apiUrl.apiGetMediaLists(), body, { 'params': params })
  }

  // Save Media
  saveMedia(mediaData) {
    return this.http.post<any>(this.apiUrl.apiSaveMedia(), mediaData);
  }

  // Save Media
  getMediaUploadURL(mediaData) {
    return this.http.post<any>(this.apiUrl.apiGetMediaUploadURL(), mediaData);
  }

  // Update Media Content
  updateMediaContent(mediaData) {
    return this.http.post<any>(this.apiUrl.apiUpdateMediaContent(), mediaData);
  }

  // Like & Pin Actions
  mediaLikePinAction(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('mediaId', data.mediaId)
      .set('ismain', data.ismain)
      .set('status', data.status)
      .set('type', data.type)
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiMediaLikePinAction(), body, { 'params': params });
  }

  // Delete Media Api
  deleteMedia(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('mediaId', JSON.stringify(data.mediaId))
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiDeleteMedia(), body, { 'params': params })
  }

}
