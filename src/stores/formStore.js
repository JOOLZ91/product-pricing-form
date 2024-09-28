import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: {
      description: '',
      sendConfirmation: null,
      VAT: '',
      priceNetto: '',
      charLength: 255
    },
    validationErrors: {
      description: '',
      sendConfirmation: '',
      VAT: '',
      priceNetto: ''
    }
  }),
  actions: {
    updateField(field, value) {
      this.formData[field] = value
      this.validateField(field)
    },
    validateField(field) {
      if (field === 'description') {
        if (!this.formData.description) {
          this.validationErrors.description = 'Text is required'
        } else if (this.formData.description.length > this.formData.charLength) {
          this.validationErrors.description = `You can’t enter more than ${this.formData.charLength} characters`
        } else {
          this.validationErrors.description = ''
        }
      }

      if (field === 'sendConfirmation') {
        if (this.formData.sendConfirmation === null) {
          this.validationErrors.sendConfirmation = 'Text is required'
        } else {
          this.validationErrors.sendConfirmation = ''
        }
      }

      if (field === 'VAT') {
        if (!this.formData.VAT) {
          this.validationErrors.VAT = 'Text is required'
        } else {
          this.validationErrors.VAT = ''
        }
      }

      if (field === 'priceNetto') {
        const numberPattern = /^[0-9]+([.,][0-9]{1,2})?$/
        if (!this.formData.priceNetto) {
          this.validationErrors.priceNetto = 'Text is required'
        } else if (!numberPattern.test(this.formData.priceNetto)) {
          this.validationErrors.priceNetto = 'Please, input number'
        } else {
          this.validationErrors.priceNetto = ''
        }
      }
    },
    resetForm() {
      this.formData.description = ''
      this.formData.sendConfirmation = null
      this.formData.VAT = ''
      this.formData.priceNetto = ''
      this.validationErrors.description = ''
      this.validationErrors.sendConfirmation = ''
      this.validationErrors.VAT = ''
      this.validationErrors.priceNetto = ''
    }
  },
  getters: {
    isFormValid: (state) => {
      return (
        !state.validationErrors.description &&
        !state.validationErrors.sendConfirmation &&
        !state.validationErrors.VAT &&
        !state.validationErrors.priceNetto &&
        state.formData.description &&
        state.formData.sendConfirmation !== null &&
        state.formData.VAT &&
        state.formData.priceNetto
      )
    },
    priceBrutto: (state) => {
      const netto = parseFloat(state.formData.priceNetto.replace(',', '.'))
      const vatPercentage = parseFloat(state.formData.VAT.replace('%', ''))
      if (!isNaN(netto) && !isNaN(vatPercentage)) {
        const brutto = netto + (netto * vatPercentage) / 100
        return brutto.toFixed(2)
      }
      return '0.00'
    }
  }
})
