import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatSliderModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatMenuModule,
  MatToolbarModule,
  MatRadioButton,
  MatRadioModule,
} from "@angular/material";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { NgxImageCompressService } from "ngx-image-compress";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DpDatePickerModule } from "ng2-date-picker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ToastModule} from 'primeng/toast';
// import { GoogleChartsModule } from 'angular-google-charts';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgbModule, NgbActiveModal, NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import { ClickOutsideModule } from "ng-click-outside";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { AccordionModule } from "primeng/accordion";
import { MatBadgeModule } from "@angular/material";
import { EditorModule } from "primeng/editor";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputNumberModule } from "primeng/inputnumber";
import { MenubarModule } from 'primeng/menubar';
import { SliderModule } from "primeng/slider";
import { SidebarModule } from "primeng/sidebar";
import { TabViewModule } from "primeng/tabview";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { BsDropdownModule, BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { RadioButtonModule } from 'primeng/radiobutton';

import { FilterComponent } from "../../components/common/filter/filter.component";
import { ScrollTopService } from "../../services/scroll-top.service";
import { HeaderComponent } from "../../layouts/header/header.component";
import { ProbingHeaderComponent } from "../../layouts/probing-header/probing-header.component";
import { ProductHeaderComponent } from "../../layouts/product-header/product-header.component";
import { SidebarComponent } from "../../layouts/sidebar/sidebar.component";
import { MarketplaceSidebarComponent } from "../../layouts/marketplace-sidebar/marketplace-sidebar.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { RemoveWhiteSpacePipe } from "../../common/pipes/remove-white-space.pipe";
import { ConfirmationComponent } from "../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../components/common/submit-loader/submit-loader.component";
import { SuccessComponent } from "../../components/common/success/success.component";
import { SuccessModalComponent } from "../../components/common/success-modal/success-modal.component";
import { ProductMakeComponent } from "../../components/common/product-make/product-make.component";
import { WorkstreamListComponent } from "../../components/common/workstream-list/workstream-list.component";
import { ApplicationComponent } from "../../components/common/application/application.component";
import { TagViewComponent } from "../../components/common/tag-view/tag-view.component";
import { ErrorCodeViewComponent } from "../../components/common/error-code-view/error-code-view.component";
import { AttachmentViewComponent } from "../../components/common/attachment-view/attachment-view.component";
import { SystemInfoViewComponent } from "../../components/common/system-info-view/system-info-view.component";
import { ModelsComponent } from "../../components/common/models/models.component";
import { YearsComponent } from "../../components/common/years/years.component";
import { SecWorkstreamsComponent } from "../../components/common/sec-workstreams/sec-workstreams.component";
import { TagsComponent } from "../../components/common/tags/tags.component";
import { ActionFormComponent } from "../../components/common/action-form/action-form.component";
import { ErrorCodeListsComponent } from "../../components/common/error-code-lists/error-code-lists.component";
import { ManageListComponent } from "../../components/common/manage-list/manage-list.component";
import { ManageGeoListComponent } from "../../components/common/manage-geo-list/manage-geo-list.component";
import { RelatedThreadListsComponent } from "../../components/common/related-thread-lists/related-thread-lists.component";
import { MakeComponent } from "../../components/common/make/make.component";
import { FileAttachmentComponent } from "../../components/common/file-attachment/file-attachment.component";
import { FileUploadModule } from "primeng/fileupload";
import { UploadAttachmentsComponent } from "../../components/common/upload-attachments/upload-attachments.component";
import { InputTextModule } from "primeng/inputtext";
import { LandingpageHeaderComponent } from "../../layouts/landingpage-header/landingpage-header.component";
import { LandingLeftSideMenuComponent } from "../../components/common/landing-left-side-menu/landing-left-side-menu.component";
import { DomainMembersComponent } from "../../components/common/domain-members/domain-members.component";
import { AnnouncementListComponent } from "../../components/common/announcement-list/announcement-list.component";
import { AnnouncementUserViewComponent } from "../../components/common/announcement-user-view/announcement-user-view.component";
import { AnnouncementWidgetsComponent } from "../../components/common/announcement-widgets/announcement-widgets.component";
import { EscalationWidgetsComponent } from "../../components/common/escalation-widgets/escalation-widgets.component";
import { RecentViewedWidgetsComponent } from "../../components/common/recent-viewed-widgets/recent-viewed-widgets.component";
import { RecentSearchesWidgetsComponent } from "../../components/common/recent-searches-widgets/recent-searches-widgets.component";
import { MyMetricsWidgetsComponent } from "../../components/common/my-metrics-widgets/my-metrics-widgets.component";
import { LandingReportWidgtsComponent } from "../../components/common/landing-report-widgts/landing-report-widgts.component";
import { AddLinkComponent } from "../../components/common/add-link/add-link.component";
import { MediaTypesComponent } from "../../components/common/media-types/media-types.component";
import { AppUserNotificationsComponent } from "../../components/common/app-user-notifications/app-user-notifications.component";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { FcmMessagingService } from "../../services/fcm-messaging/fcm-messaging.service";
import { TotaluserPopupComponent } from "./totaluser-popup/totaluser-popup.component";
import { ManageUserComponent } from "../../components/common/manage-user/manage-user.component";
import { ThreadsPageComponent } from "../../components/common/threads-page/threads-page.component";
import { StatusComponent } from "../../components/common/status/status.component";
import { MediaInfoComponent } from "../../components/common/media-info/media-info.component";
import { PartsListComponent } from "../../components/common/parts-list/parts-list.component";
import { GridsterModule } from "angular-gridster2";
import { NgxMasonryModule } from "ngx-masonry";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { PhoneMaskDirective } from "../../phone-mask.directive";
import { ViewPolicyComponent } from "../../components/common/view-policy/view-policy.component";
// import { DragDropDirective } from 'src/app/common/directive/drag-drop.directive';
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { EmptyContainerComponent } from "../../components/common/empty-container/empty-container.component";
import { AuthFooterComponent } from "../../components/common/auth-footer/auth-footer.component";
import { AuthRightPanelComponent } from "../../components/common/auth-right-panel/auth-right-panel.component";
import { AuthSuccessComponent } from "../../components/common/auth-success/auth-success.component";
import { DomainUrlComponent } from "../../components/common/domain-url/domain-url.component";
import { ForgotpasswordComponent } from "../../components/common/forgotpassword/forgotpassword.component";
import { NonUserComponent } from "../../components/common/non-user/non-user.component";
import { ContentPopupComponent } from '../../components/common/content-popup/content-popup.component';
import { VerifyEmailComponent } from "../../components/common/verify-email/verify-email.component";
import { ProfileBusinessComponent } from "../../components/common/profile-business/profile-business.component";
import { ProfilePersonalComponent } from "../../components/common/profile-personal/profile-personal.component";
import { ProfileMetricsComponent } from "../../components/common/profile-metrics/profile-metrics.component";
import { ProfileCertificateComponent } from "../../components/common/profile-certificate/profile-certificate.component";
import { ChangePasswordComponent } from "../../components/common/change-password/change-password.component";
import { CreateFolderComponent } from "../../components/common/create-folder/create-folder.component";
import { CreateCategoryComponent } from '../../components/common/create-category/create-category.component';
import { MultiSelectComponent } from "../../components/common/multi-select/multi-select.component";
import { DynamicFieldsComponent } from "../../components/common/dynamic-fields/dynamic-fields.component";
import { DynamicValuesComponent } from "../../components/common/dynamic-values/dynamic-values.component";
import { DynamicPageViewComponent } from '../../components/common/dynamic-page-view/dynamic-page-view.component';
import { DynamicDetailHeaderComponent } from '../../layouts/dynamic-detail-header/dynamic-detail-header.component';
import { ImageCropperComponent } from "../../components/common/image-cropper/image-cropper.component";
import { ImageCropperModule } from "../../image-cropper/image-cropper.module";
import { CertificationComponent } from "../../components/common/certification/certification.component";
import { FollowersFollowingComponent } from "../../components/common/followers-following/followers-following.component";
import { CommonNotificationsComponent } from "../../components/common/common-notifications/common-notifications.component";
import { NewEditHeaderComponent } from '../../layouts/new-edit-header/new-edit-header.component';
import { ThreadDetailHeaderComponent } from "../../layouts/thread-detail-header/thread-detail-header.component";
import { ThreadDetailViewComponent } from "../../components/common/thread-detail-view/thread-detail-view.component";
import { DetailViewComponent } from "../../components/common/detail-view/detail-view.component";
import { DocumentApprovalComponent } from 'src/app/components/common/document-approval/document-approval.component';
import { ListComponent } from 'src/app/components/common/document-approval/list/list.component';
import { KaizenApprovalComponent } from 'src/app/components/common/kaizen-approval/kaizen-approval.component';
import { KzListComponent } from 'src/app/components/common/kaizen-approval/kz-list/kz-list.component';
import { ApprovedKzListComponent } from 'src/app/components/common/kaizen-approval/approved-kz-list/approved-kz-list.component';
import { DocumentsComponent } from "src/app/components/common/documents/documents.component";
import { DocumentsNewComponent } from 'src/app/components/common/documents-new/documents-new.component';
import { DocumentsOldComponent } from 'src/app/components/common/documents-old/documents-old.component';
import { FilesComponent } from "src/app/components/common/documents/files/files.component";
import { FoldersComponent } from "src/app/components/common/documents/folders/folders.component";
import { DocInfoComponent } from "src/app/components/common/doc-info/doc-info.component";
import { DirectoryInfoComponent } from 'src/app//components/common/directory-info/directory-info.component';
import { TableModule } from "primeng/table";
import { CountryPhonenumberComponent } from "../../components/common/country-phonenumber/country-phonenumber.component";
import { ExportPopupComponent } from "../../components/common/export-popup/export-popup.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { KnowledgeArticlesComponent } from "src/app/components/common/knowledge-articles/knowledge-articles.component";
import { DaysLoginPOPUPComponent } from '../../components/common/days-login-popup/days-login-popup.component';
import { WelcomeHomeComponent } from "../../components/common/welcome-home/welcome-home.component";
import { ManageProductCodesComponent } from "../../components/common/manage-product-codes/manage-product-codes.component";
import { VehicleModelsComponent } from "src/app/components/vehicle-models/vehicle-models.component";
import { EmissionsComponent } from '../../components/emissions/emissions.component';
import { ManageListComponentGTS } from "src/app/components/common/manage-list-gts/manage-list.component";
import { GtsListsComponent } from "src/app/components/common/gts-lists/gts-lists.component";
import { SibListComponent } from 'src/app/components/common/sib-list/sib-list.component';
import { SibApplicationComponent } from 'src/app/components/common/sib-application/sib-application.component';
import { SelectCountryComponent } from '../../components/common/select-country/select-country.component';
import { KnowledgeBaseListComponent } from '../../components/common/knowledge-base-list/knowledge-base-list.component';
import { DirectoryListComponent } from 'src/app/components/common/directory-list/directory-list.component';
import { CardModule } from "primeng/card";
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { CustomAccordionTabComponent } from "src/app/components/common/custom-accordion-tab/custom-accordion-tab.component";
import { SupportRequestWidgetComponent } from "src/app/components/common/support-request-widget/support-request-widget.component";
import { RecentTechInfoWidgetsComponent } from 'src/app/components/common/recent-tech-info-widgets/recent-tech-info-widgets.component';
import { MySupportRequestWidgetsComponent } from 'src/app/components/common/my-support-request-widgets/my-support-request-widgets.component';
import { MyPinnedContentComponent } from 'src/app/components/common/my-pinned-content/my-pinned-content.component';
import { DialogPopupComponent } from 'src/app/components/common/dialog-popup/dialog-popup.component';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { MediaAttachmentComponent } from 'src/app/components/common/media-attachment/media-attachment.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { SafePipePipe } from 'src/app/common/pipes/safe-pipe.pipe';
import { SafeHtmlPipe } from '../../common/pipes/safe-html.pipe';
import { RemoveMediaComponent } from 'src/app/components/common/remove-media/remove-media.component';
import { ChipsModule } from 'primeng/chips';
import { DispatchPageComponent } from "../../components/common/dispatch-page/dispatch-page.component";
import { GMapModule } from 'primeng/gmap';
import { AudioDescAttachmentComponent } from 'src/app/components/common/audio-desc-attachment/audio-desc-attachment.component';
import { AudioAttachmentViewComponent } from 'src/app/components/common/audio-attachment-view/audio-attachment-view.component';
import { DynamicAttachmentComponent } from 'src/app/components/common/dynamic-attachment/dynamic-attachment.component';
import { DynamicAttachmentViewComponent } from 'src/app/components/common/dynamic-attachment-view/dynamic-attachment-view.component';
import { TagModule } from 'primeng/tag';
import { KaCategoryComponent } from 'src/app/components/common/ka-category/ka-category.component';
import { DocListComponent } from 'src/app/components/common/documents/doc-list/doc-list.component';
import { ExportFileComponent } from 'src/app/components/common/export-file/export-file.component';
import { StandardReportListComponent } from 'src/app/components/common/standard-report-list/standard-report-list.component';
import { TimelineModule } from "primeng/timeline";
import { NoPermissionPopupComponent } from 'src/app/components/common/no-permission-popup/no-permission-popup.component';
import { TechsupportListComponent } from 'src/app/components/common/techsupport-list/techsupport-list.component';
import { TechsupportTeamListComponent } from 'src/app/components/common/techsupport-team-list/techsupport-team-list.component';
import { MyTicketsWidgetsComponent } from 'src/app/components/common/my-tickets-widgets/my-tickets-widgets.component';
import { TeamSupportRequestWidgetsComponent } from 'src/app/components/common/team-support-request-widgets/team-support-request-widgets.component';
import { RegisteredTrainingsWidgetsComponent } from 'src/app/components/common/registered-trainings-widgets/registered-trainings-widgets.component';
import { TeamMembersStatusWidgetsComponent } from 'src/app/components/common/team-members-status-widgets/team-members-status-widgets.component';
import { YourPerformanceStatsWidgetsComponent } from 'src/app/components/common/your-performance-stats-widgets/your-performance-stats-widgets.component';
import { RecentMacrosWidgetsComponent } from 'src/app/components/common/recent-macros-widgets/recent-macros-widgets.component';
import { OpportunityListsComponent } from 'src/app/components/common/opportunity-lists/opportunity-lists.component';
import { RequiredFieldsComponent } from 'src/app/components/common/required-fields/required-fields.component';
import { ThreadViewRecentComponent } from '../../components/common/thread-view-recent/thread-view-recent.component';
import { ThreadViewReplyComponent } from '../../components/common/thread-view-reply/thread-view-reply.component';
import { ThreadViewReplyPublicComponent } from '../../components/common/thread-view-reply-public/thread-view-reply-public.component';
import { ThreadApprovalComponent } from 'src/app/components/common/thread-approval/thread-approval.component';
import { PaymentControllerComponent } from "src/app/components/common/payment-controller/payment-controller.component";
import { PopupComponent } from "../chat/chat-page/popup/popup.component";
import { ChatReplyMessagePopupComponent } from "../chat/chat-reply-message-popup/chat-reply-message-popup.component";
import { ManualsPaymentControllerComponent } from "src/app/components/common/manuals-payment-controller/manuals-payment-controller.component";
import { PresetsManageComponent } from '../../components/common/presets-manage/presets-manage.component';
import { PresetsListComponent } from '../../components/common/presets-list/presets-list.component';
import { BugAndFeatureComponent } from "src/app/components/common/bug-and-feature/bug-and-feature.component";
import { BugFeaDetailsComponent } from "src/app/components/common/bug-fea-details/bug-fea-details.component";
import { ViewTraningDetailComponent } from '../../components/common/view-traning-detail/view-traning-detail.component';
import { MarketplaceHeaderComponent } from '../../layouts/marketplace-header/marketplace-header.component';
import { MarketplaceFooterComponent } from '../../layouts/marketplace-footer/marketplace-footer.component';
import { MarketplaceSystemactivityComponent } from '../../components/common/marketplace-systemactivity/marketplace-systemactivity.component';
import { ShopListComponent } from 'src/app/components/common/shop-list/shop-list.component';
import { ShopListMapComponent } from 'src/app/components/common/shop-list-map/shop-list-map.component';
import { ViewDocumentDetailComponent } from 'src/app/components/common/view-document-detail/view-document-detail.component';
import { ViewAnnouncementDetailComponent } from 'src/app/components/common/view-announcement-detail/view-announcement-detail.component';
import { AuditListComponent } from 'src/app/components/common/audit-list/audit-list.component';
import { InspectionListComponent } from 'src/app/components/common/inspection-list/inspection-list.component';
import { ViewKaDetailComponent } from 'src/app/components/common/view-ka-detail/view-ka-detail.component';
import { RepairOrderListComponent } from 'src/app/components/common/repair-order-list/repair-order-list.component';
import { ViewRoDetailComponent } from 'src/app/components/common/view-ro-detail/view-ro-detail.component';
import { RepairOrderDetailViewComponent } from 'src/app/components/common/repair-order-detail-view/repair-order-detail-view.component';
import { RepairOrderManageComponent } from 'src/app/components/common/repair-order-manage/repair-order-manage.component';
import { FaqListComponent } from 'src/app/components/common/faq-list/faq-list.component';
import { RoEstimationComponent } from 'src/app/components/common/ro-estimation/ro-estimation.component';
import { CustomerListComponent } from 'src/app/components/common/customer-list/customer-list.component';
import { SearchFilterComponent } from 'src/app/layouts/search-filter/search-filter.component';
import { FixThreadsComponent } from 'src/app/components/common/fix-threads/fix-threads.component';
import { DashSummaryTopComponent } from 'src/app/components/common/dash-summary-top/dash-summary-top.component';
import { DashSummaryCenterComponent } from 'src/app/components/common/dash-summary-center/dash-summary-center.component';
import { KnowledgeArticlesSolrComponent } from 'src/app/components/common/knowledge-articles-solr/knowledge-articles-solr.component';
import { KaCategorySolrComponent } from 'src/app/components/common/ka-category-solr/ka-category-solr.component';
import { AdasListComponent } from 'src/app/components/common/adas-list/adas-list.component';
import { AdasFilesComponent } from 'src/app/components/common/adas-files/adas-files.component';
import { AdasViewComponent } from 'src/app/components/common/adas-view/adas-view.component';
import { GtsSessionsListComponent } from 'src/app/components/common/gts-sessions-list/gts-sessions-list.component';
import { HeadquartersListComponent } from 'src/app/components/common/headquarters-list/headquarters-list.component';
import { HeadquartersHomeComponent } from 'src/app/components/common/headquarters-home/headquarters-home.component';
import { UserAddComponent } from "../headquarters/user-add/user-add.component";
import { UserRenamePopupComponent } from './user-rename-popup/user-rename-popup.component';
import { RenamePopupComponent } from './rename-popup/rename-popup.component';
import { LocationDetailComponent } from 'src/app/components/common/location-detail/location-detail.component';
import { UserGridInfoComponent } from "../headquarters/user-grid-info/user-grid-info.component";
import { UserListComponent } from '../headquarters/user-list/user-list.component';
import { CarouselModule } from "primeng/carousel";
import { GalleriaModule } from 'primeng/galleria';
import { ToolsListComponent } from '../headquarters/tools-list/tools-list.component';
import { AllNetworksListComponent } from '../headquarters/all-networks-list/all-networks-list.component';
import { ProductHistoryComponent } from '../headquarters/product-history/product-history.component';
import { ProductDetailsComponent } from "../headquarters/product-details/product-details.component";
import { AddToolsComponent } from "../headquarters/add-tools/add-tools.component";
import { AddProductComponent } from "../headquarters/add-product/add-product.component";
import { ToolsListLocationsComponent } from "../headquarters/tools-list-locations/tools-list-locations.component";
import { DekraAuditListComponent } from 'src/app/components/common/dekra-audit-list/dekra-audit-list.component';
import { InspectionLocationListComponent } from '../headquarters/inspection-location-list/inspection-location-list.component';
import { localDatePipe } from "../headquarters/headquarters/locaDatePipe";
import { UserProfileSectionComponent } from 'src/app/components/common/user-profile-section/user-profile-section.component';
import { UserProfileSectionManageComponent } from 'src/app/components/common/user-profile-section-manage/user-profile-section-manage.component';
import { AddProductStepOneComponent } from "../headquarters/add-product-step-one/add-product-step-one.component";
import { UpdatenamePopupComponent } from './updatename-popup/updatename-popup.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
};

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    PaymentControllerComponent,
    ManualsPaymentControllerComponent,
    AddProductComponent,
    HeaderComponent,
    ProbingHeaderComponent,
    ProductHeaderComponent,
    SidebarComponent,
    MarketplaceSidebarComponent,
    FilterComponent,
    FooterComponent,
    RemoveWhiteSpacePipe,
    ConfirmationComponent,
    SubmitLoaderComponent,
    SuccessComponent,
    SuccessModalComponent,
    WorkstreamListComponent,
    ProductMakeComponent,
    ApplicationComponent,
    VehicleModelsComponent,
    EmissionsComponent,
    TagViewComponent,
    ErrorCodeViewComponent,
    FileAttachmentComponent,
    AudioDescAttachmentComponent,
    AudioAttachmentViewComponent,
    DynamicAttachmentComponent,
    DynamicAttachmentViewComponent,
    KaCategoryComponent,
    DocListComponent,
    ExportFileComponent,
    UploadAttachmentsComponent,
    AttachmentViewComponent,
    SystemInfoViewComponent,
    ModelsComponent,
    YearsComponent,
    SecWorkstreamsComponent,
    GtsListsComponent,
    TagsComponent,
    ActionFormComponent,
    ErrorCodeListsComponent,
    ManageListComponent,
    ManageListComponentGTS,
    ManageGeoListComponent,
    RelatedThreadListsComponent,
    MakeComponent,
    LandingpageHeaderComponent,
    LandingLeftSideMenuComponent,
    DomainMembersComponent,
    AnnouncementListComponent,
    AnnouncementUserViewComponent,
    AnnouncementWidgetsComponent,
    EscalationWidgetsComponent,
    RecentViewedWidgetsComponent,
    RecentSearchesWidgetsComponent,
    MyMetricsWidgetsComponent,
    LandingReportWidgtsComponent,
    AddLinkComponent,
    AppUserNotificationsComponent,
    MediaTypesComponent,
    TotaluserPopupComponent,
    ManageUserComponent,
    ThreadsPageComponent,
    OpportunityListsComponent,
    KnowledgeArticlesComponent,
    KnowledgeBaseListComponent,
    KnowledgeArticlesSolrComponent,
    KaCategorySolrComponent, 
    StatusComponent,
    MediaInfoComponent,
    PartsListComponent,
    EmptyContainerComponent,
    AuthFooterComponent,
    AuthRightPanelComponent,
    AuthSuccessComponent,
    DomainUrlComponent,
    ForgotpasswordComponent,
    NonUserComponent,
    ContentPopupComponent,
    VerifyEmailComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    ProfileMetricsComponent,
    ProfileCertificateComponent,
    ChangePasswordComponent,
    CreateFolderComponent,
    CreateCategoryComponent,
    PhoneMaskDirective,
    ViewPolicyComponent,
    MultiSelectComponent,
    DynamicFieldsComponent,
    DynamicValuesComponent,
    DynamicPageViewComponent,
    DynamicDetailHeaderComponent,
    ImageCropperComponent,
    CertificationComponent,
    FollowersFollowingComponent,
    CommonNotificationsComponent,
    FilesComponent,
    FoldersComponent,
    NewEditHeaderComponent,
    ThreadDetailHeaderComponent,
    ThreadDetailViewComponent,
    DetailViewComponent,
    DocumentsComponent,
    DocumentsNewComponent,
    DocumentsOldComponent,
    DocumentApprovalComponent,
    ListComponent,
    KaizenApprovalComponent,
    KzListComponent,
    ApprovedKzListComponent,
    DocInfoComponent,
    DirectoryInfoComponent,
    CountryPhonenumberComponent,
    ExportPopupComponent,
    WelcomeHomeComponent,
    DaysLoginPOPUPComponent,
    SelectCountryComponent,
    ManageProductCodesComponent,
    SibListComponent,
    SibApplicationComponent,
    DirectoryListComponent,
    CustomAccordionTabComponent,
    SupportRequestWidgetComponent,
    RecentTechInfoWidgetsComponent,
    MySupportRequestWidgetsComponent,
    MyTicketsWidgetsComponent,
    TeamSupportRequestWidgetsComponent,
    RegisteredTrainingsWidgetsComponent,
    TeamMembersStatusWidgetsComponent,
    YourPerformanceStatsWidgetsComponent,
    RecentMacrosWidgetsComponent,
    MyPinnedContentComponent,
    DialogPopupComponent,
    NoPermissionPopupComponent,
    MediaUploadComponent,
    MediaAttachmentComponent,
    SafePipePipe,
    SafeHtmlPipe,
    RemoveMediaComponent,
    //DragDropDirective,
    DispatchPageComponent,
    StandardReportListComponent,
    TechsupportListComponent,
    TechsupportTeamListComponent,
    RequiredFieldsComponent,
    ThreadViewRecentComponent,
    ThreadViewReplyComponent,
    ThreadViewReplyPublicComponent,
    ThreadApprovalComponent,
    PopupComponent,
    ChatReplyMessagePopupComponent,
    PresetsManageComponent,
    PresetsListComponent,
    ViewDocumentDetailComponent,
    BugAndFeatureComponent,
    BugFeaDetailsComponent,
    ViewTraningDetailComponent,
    MarketplaceHeaderComponent,
    MarketplaceFooterComponent,
    MarketplaceSystemactivityComponent,
    ShopListComponent,
    ShopListMapComponent,
    ViewAnnouncementDetailComponent,
    AuditListComponent,
    InspectionListComponent,
    ViewKaDetailComponent,
    RepairOrderListComponent,
    ViewRoDetailComponent,
    RepairOrderDetailViewComponent,
    RepairOrderManageComponent,
    FaqListComponent,
    RoEstimationComponent,
    CustomerListComponent,
    SearchFilterComponent,
    FixThreadsComponent,
    DashSummaryTopComponent,
    DashSummaryCenterComponent,
    AdasListComponent,
    AdasFilesComponent,
    AdasViewComponent,
    GtsSessionsListComponent,
    HeadquartersListComponent,
    LocationDetailComponent,
    HeadquartersHomeComponent,
    UserAddComponent,
    UserRenamePopupComponent,
    RenamePopupComponent,
    UserGridInfoComponent,
    UserListComponent,
    ToolsListComponent,
    AllNetworksListComponent,
    ToolsListLocationsComponent,
    ProductHistoryComponent,
    ProductDetailsComponent,
    DekraAuditListComponent,
    InspectionLocationListComponent,
    localDatePipe,
    UserProfileSectionComponent,
    UserProfileSectionManageComponent,
    AddProductStepOneComponent,
    UpdatenamePopupComponent
    // AddToolsComponent,
    // AddProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // GoogleChartsModule,
    ScrollingModule,
    ToastModule,
    DragDropModule,
    MatInputModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSliderModule,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ClickOutsideModule,
    FileUploadModule,
    NgbModule,
    NgbPopoverModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
    InputSwitchModule,
    InputNumberModule,
    MenubarModule,
    SliderModule,
    SidebarModule,
    TabViewModule,
    AccordionModule,
    InputTextModule,
    MatBadgeModule,
    EditorModule,
    InputTextModule,
    CalendarModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    GridsterModule,
    NgxMasonryModule,
    NgxYoutubePlayerModule,
    PerfectScrollbarModule,
    ImageCropperModule,
    TableModule,
    NgxIntlTelInputModule,
    NgxMaskModule.forRoot(),
    BsDropdownModule,
    CardModule,
    PanelModule,
    ChipModule,
    ProgressBarModule,
    MenuModule,
    AutoCompleteModule,
    InputTextareaModule,
    ListboxModule,
    ChipsModule,
    GMapModule,
    CheckboxModule,
    TagModule,
    TimelineModule,
    RadioButtonModule,
    CarouselModule,
    GalleriaModule,
    MatRadioModule,
  ],
  exports: [
    AccordionModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    CardModule,
    PanelModule,
    ReactiveFormsModule,
    DropdownModule,
    // GoogleChartsModule,
    ScrollingModule,
    MatInputModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSliderModule,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ClickOutsideModule,
    NgbModule,
    NgbPopoverModule,
    DialogModule,
    HeaderComponent,
    ProbingHeaderComponent,
    ProductHeaderComponent,
    SidebarComponent,
    MarketplaceSidebarComponent,
    FilterComponent,
    VehicleModelsComponent,
    EmissionsComponent,
    FooterComponent,
    RemoveWhiteSpacePipe,
    WorkstreamListComponent,
    ApplicationComponent,
    TagViewComponent,
    ErrorCodeViewComponent,
    AttachmentViewComponent,
    KnowledgeArticlesComponent,
    KnowledgeArticlesSolrComponent,
    KaCategorySolrComponent, 
    KnowledgeBaseListComponent,
    FileAttachmentComponent,
    AudioDescAttachmentComponent,
    AudioAttachmentViewComponent,
    DynamicAttachmentComponent,
    DynamicAttachmentViewComponent,
    KaCategoryComponent,
    DocListComponent,
    ExportFileComponent,
    SystemInfoViewComponent,
    ModelsComponent,
    YearsComponent,
    SecWorkstreamsComponent,
    TagsComponent,
    GtsListsComponent,
    ActionFormComponent,
    ErrorCodeListsComponent,
    MakeComponent,
    FileUploadModule,
    SuccessModalComponent,
    InputTextModule,
    LandingpageHeaderComponent,
    LandingLeftSideMenuComponent,
    DomainMembersComponent,
    AnnouncementListComponent,
    AnnouncementUserViewComponent,
    AnnouncementWidgetsComponent,
    EscalationWidgetsComponent,
    RecentViewedWidgetsComponent,
    RecentSearchesWidgetsComponent,
    MyMetricsWidgetsComponent,
    LandingReportWidgtsComponent,
    MediaTypesComponent,
    MatBadgeModule,
    EditorModule,
    CalendarModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    HttpClientModule,
    TotaluserPopupComponent,
    ThreadsPageComponent,
    OpportunityListsComponent,
    StatusComponent,
    MediaInfoComponent,
    PartsListComponent,
    GridsterModule,
    NgxMasonryModule,
    NgxYoutubePlayerModule,
    PerfectScrollbarModule,
    EmptyContainerComponent,
    PaymentControllerComponent,
    ManualsPaymentControllerComponent,
    AuthFooterComponent,
    AuthRightPanelComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    ProfileMetricsComponent,
    ProfileCertificateComponent,
    PhoneMaskDirective,
    ViewPolicyComponent,
    MultiSelectComponent,
    DynamicFieldsComponent,
    DynamicPageViewComponent,
    PopupComponent,
    ChatReplyMessagePopupComponent,
    DynamicDetailHeaderComponent,
    CommonNotificationsComponent,
    DocumentsComponent,
    DocumentsNewComponent,
    DocumentsOldComponent,
    DocumentApprovalComponent,
    ListComponent,
    KaizenApprovalComponent,
    KzListComponent,
    ApprovedKzListComponent,
    DynamicValuesComponent,
    FilesComponent,
    FoldersComponent,
    NewEditHeaderComponent,
    ThreadDetailHeaderComponent,
    ThreadDetailViewComponent,
    DetailViewComponent,
    DocInfoComponent,
    DirectoryInfoComponent,
    CountryPhonenumberComponent,
    NgxIntlTelInputModule,
    ExportPopupComponent,
    SibListComponent,
    SibApplicationComponent,
    DirectoryListComponent,
    CustomAccordionTabComponent,
    SupportRequestWidgetComponent,
    RecentTechInfoWidgetsComponent,
    MySupportRequestWidgetsComponent,
    MyTicketsWidgetsComponent,
    TeamSupportRequestWidgetsComponent,
    RegisteredTrainingsWidgetsComponent,
    TeamMembersStatusWidgetsComponent,
    YourPerformanceStatsWidgetsComponent,
    RecentMacrosWidgetsComponent,
    MyPinnedContentComponent,
    ChipModule,
    ProgressBarModule,
    MenuModule,
    MediaAttachmentComponent,
    AutoCompleteModule,
    InputTextareaModule,
    ListboxModule,
    InputNumberModule,
    MenubarModule,
    InputSwitchModule,
    SafePipePipe,
    SafeHtmlPipe,
    //AngularFireModule.initializeApp(environment.firebase),
    DispatchPageComponent,
    StandardReportListComponent,
    GMapModule,
    CheckboxModule,
    TechsupportListComponent,
    TechsupportTeamListComponent,
    RequiredFieldsComponent,
    ThreadViewRecentComponent,
    ThreadViewReplyComponent,
    ThreadViewReplyPublicComponent,
    ThreadApprovalComponent,
    BugAndFeatureComponent,
    BugFeaDetailsComponent,
    MarketplaceHeaderComponent,
    MarketplaceFooterComponent,
    MarketplaceSystemactivityComponent,
    ShopListComponent,
    ShopListMapComponent,
    AuditListComponent,
    InspectionListComponent,
    RepairOrderListComponent,    
    RepairOrderDetailViewComponent,
    FaqListComponent,
    RoEstimationComponent,
    CustomerListComponent,
    SearchFilterComponent,
    FixThreadsComponent,
    DashSummaryTopComponent,
    DashSummaryCenterComponent,
    AdasListComponent,
    AdasFilesComponent,
    AdasViewComponent,
    GtsSessionsListComponent,
    HeadquartersListComponent,
    LocationDetailComponent,
    HeadquartersHomeComponent,
    UserAddComponent,
    UserGridInfoComponent,
    UserListComponent,
    ToolsListComponent,
    AllNetworksListComponent,
    ToolsListLocationsComponent,
    ProductHistoryComponent,
    DekraAuditListComponent,
    InspectionLocationListComponent,
    localDatePipe,
    UserProfileSectionComponent,
    AddProductStepOneComponent
],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    NgbActiveModal,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    ScrollTopService,
    NgxImageCompressService,
    FcmMessagingService,
    BsDropdownConfig,
  ],
  entryComponents: [
    ConfirmationComponent,
    SubmitLoaderComponent,
    SuccessComponent,
    ProductMakeComponent,
    ManageListComponent,
    ManageListComponentGTS,
    RelatedThreadListsComponent,
    UploadAttachmentsComponent,
    SuccessModalComponent,
    AddLinkComponent,
    AppUserNotificationsComponent,
    ManageGeoListComponent,
    ManageUserComponent,
    LandingLeftSideMenuComponent,
    AuthSuccessComponent,
    DomainUrlComponent,
    ForgotpasswordComponent,
    NonUserComponent,
    ContentPopupComponent,
    VerifyEmailComponent,
    ChangePasswordComponent,
    CreateFolderComponent,
    CreateCategoryComponent,
    CertificationComponent,
    ImageCropperComponent,
    FollowersFollowingComponent,
    ExportPopupComponent,
    WelcomeHomeComponent,
    DaysLoginPOPUPComponent,
    SelectCountryComponent,
    ManageProductCodesComponent,
    DialogPopupComponent,
    NoPermissionPopupComponent,
    MediaUploadComponent,
    RemoveMediaComponent,
    PresetsManageComponent,
    PresetsListComponent,
    ViewTraningDetailComponent,
    ViewAnnouncementDetailComponent,
    ViewKaDetailComponent,
    ViewRoDetailComponent,
    RepairOrderManageComponent,
    UserProfileSectionManageComponent
  ],
})
export class SharedModule {}
