export { default as LanguageInput } from '../../components/LanguageInput.vue'
export { default as Logo } from '../../components/Logo.vue'
export { default as VuetifyLogo } from '../../components/VuetifyLogo.vue'
export { default as AdminComponent } from '../../components/admin-components/AdminComponent.vue'
export { default as AdminComponentsCeoComponent } from '../../components/admin-components/CeoComponent.vue'
export { default as EmployeeFolderComponent } from '../../components/employee-page-components/EmployeeFolderComponent.vue'
export { default as EmployeeRegistrationAndListing } from '../../components/employee-page-components/EmployeeRegistrationAndListing.vue'
export { default as FileDepartmentComponent } from '../../components/file-page-components/File-department-component.vue'
export { default as FileDownloadComponent } from '../../components/file-page-components/File-download-component.vue'
export { default as FileUploadComponent } from '../../components/file-page-components/File-upload-component.vue'
export { default as FileUploadEmployee } from '../../components/file-page-components/FileUploadEmployee.vue'
export { default as ProductPageComponentsCreateRecipeComponent } from '../../components/product-page-components/CreateRecipeComponent.vue'
export { default as ProductPageComponentsProductsListing } from '../../components/product-page-components/ProductsListing.vue'
export { default as ProductPageComponentsRecipeComponent } from '../../components/product-page-components/RecipeComponent.vue'
export { default as PlanningCalendar } from '../../components/planning-components/PlanningCalendar.vue'
export { default as PlanningCalendarDepartment } from '../../components/planning-components/PlanningCalendarDepartment.vue'
export { default as PlanningCalendarReadOnly } from '../../components/planning-components/PlanningCalendarReadOnly.vue'
export { default as FolderComponentsAdminBaseFolderComponent } from '../../components/folder-components/AdminBaseFolderComponent.vue'
export { default as FolderComponentsAdminFolderComponent } from '../../components/folder-components/AdminFolderComponent.vue'
export { default as UserAccount } from '../../components/user-page-components/UserAccount.vue'
export { default as UserChanges } from '../../components/user-page-components/UserChanges.vue'
export { default as UserContactUpdate } from '../../components/user-page-components/UserContactUpdate.vue'
export { default as UserGenderUpdate } from '../../components/user-page-components/UserGenderUpdate.vue'
export { default as UserNameUpdate } from '../../components/user-page-components/UserNameUpdate.vue'
export { default as UserPhotoUpdate } from '../../components/user-page-components/UserPhotoUpdate.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
