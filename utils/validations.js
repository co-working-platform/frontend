const required = (propertyType) => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.length > 0 || `You must input a ${propertyType}`
}
const minLength = (propertyType, minLength) => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.length >= minLength || `${propertyType} must be at least ${minLength} characters`
}
const maxLength = (propertyType, maxLength) => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.length <= maxLength || `${propertyType} must be less than ${maxLength} characters`
}

const emailFormat = () => {
  const regex = /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,24})+$/
  // eslint-disable-next-line no-mixed-operators
  return v => v && regex.test(v) || 'Must be a valid email'
}

const numberFormat = () => {
  const regex = /^[/+]?[(]?[0-9]{3}[)]?[-\s/.]?[0-9]{3}[-\s/.]?[0-9]{4,6}$/im
  // eslint-disable-next-line no-mixed-operators
  return v => v && regex.test(v) || 'Must be a valid phone number'
}

export default {
  required,
  minLength,
  maxLength,
  emailFormat,
  numberFormat,
}
