<script setup>
import { useFormStore } from '../stores/formStore'
import { computed, ref } from 'vue'
import axios from 'axios'

const formStore = useFormStore()

const formData = formStore.formData
const validationErrors = formStore.validationErrors

const submissionSuccess = ref(false)
const submissionError = ref('')
const isSubmitting = ref(false)

const isFormValid = computed(() => formStore.isFormValid)
const remainingCharacters = computed(
  () => formStore.formData.charLength - formData.description.length
)
const priceBrutto = computed(() => formStore.priceBrutto)

const handleInput = (e) => {
  switch (e.target.id) {
    case 'description':
      formStore.validateField('description')
      break
    case 'yes':
    case 'no':
      formStore.validateField('sendConfirmation')
      break
    case 'VAT':
      formStore.validateField('VAT')
      break
    case 'priceNetto':
      formStore.validateField('priceNetto')
      break
  }
}

const submitForm = async () => {
  submissionError.value = ''

  formStore.validateField('description')
  formStore.validateField('sendConfirmation')
  formStore.validateField('VAT')
  formStore.validateField('priceNetto')

  if (isFormValid.value) {
    isSubmitting.value = true
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        description: formData.description,
        sendConfirmation: formData.sendConfirmation,
        VAT: formData.VAT,
        priceNetto: formData.priceNetto,
        priceBrutto: priceBrutto.value
      })

      if (response.status === 201 || response.status === 200) {
        submissionSuccess.value = true
      }
    } catch (error) {
      submissionError.value = 'An error occurred while submitting the form. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>

<template>
  <div class="form-wrapper">
    <div v-if="submissionSuccess" class="success-box">
      <p>Your form has been successfully submitted.</p>
    </div>

    <form class="form-container" v-if="!submissionSuccess" @submit.prevent="submitForm">
      <h2>Product description and pricing form</h2>
      <h3>Provide details about your product and calculate the final price with VAT</h3>
      <div class="form-groups">
        <!-- Description -->
        <div class="form-group form-description">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            @input="handleInput"
            placeholder="Enter a description"
          ></textarea>
          <div class="form-description__wrapper">
            <p v-if="validationErrors.description" class="error-message">
              {{ validationErrors.description }}
            </p>
            <p class="char-text">{{ remainingCharacters }} characters remaining</p>
          </div>
        </div>
        <!-- Send Confirmation -->
        <div class="form-group form-confirmation">
          <label>Send Confirmation</label>
          <div class="form-confirmation__wrapper">
            <div class="form-confirmation__group">
              <input
                type="radio"
                id="yes"
                value="yes"
                v-model="formData.sendConfirmation"
                @change="handleInput"
              />
              <label for="yes">Yes</label>
            </div>
            <div class="form-confirmation__group">
              <input
                type="radio"
                id="no"
                value="no"
                v-model="formData.sendConfirmation"
                @change="handleInput"
              />
              <label for="no">No</label>
            </div>
          </div>
          <p v-if="validationErrors.sendConfirmation" class="error-message">
            {{ validationErrors.sendConfirmation }}
          </p>
        </div>
        <!-- VAT -->
        <div class="form-group form-vat">
          <label for="VAT">VAT</label>
          <select id="VAT" v-model="formData.VAT" @change="handleInput">
            <option disabled value="">Choose VAT</option>
            <option value="19%">19%</option>
            <option value="21%">21%</option>
            <option value="23%">23%</option>
            <option value="25%">25%</option>
          </select>

          <p v-if="validationErrors.VAT" class="error-message">
            {{ validationErrors.VAT }}
          </p>
        </div>
        <!-- Price Netto -->
        <div class="form-group form-price-netto">
          <label for="priceNetto">Price netto EUR</label>
          <input
            id="priceNetto"
            type="text"
            v-model="formData.priceNetto"
            :disabled="!formData.VAT"
            @input="handleInput"
            placeholder="Enter price netto"
          />

          <p v-if="validationErrors.priceNetto" class="error-message">
            {{ validationErrors.priceNetto }}
          </p>
        </div>
        <!-- Price Brutto -->
        <div class="form-group form-price-brutto">
          <label for="priceBrutto">Price brutto EUR</label>
          <input id="priceBrutto" type="text" :value="priceBrutto" disabled />
        </div>
      </div>
      <p v-if="submissionError" class="error-message">{{ submissionError }}</p>
      <!-- Submit -->
      <button type="submit">Submit</button>
      <!-- Loading -->
      <div v-if="isSubmitting" class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 450px;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 15px;
}

.form-groups {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.form-description {
  display: flex;
  flex-direction: column;
}
.form-description__wrapper {
  display: flex;
  justify-content: space-between;
}
.form-confirmation__wrapper {
  display: flex;
}
.form-confirmation__group {
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.form-confirmation__group label {
  margin: 0 0 0 5px;
}
.char-text {
  color: var(--primary-color);
  margin-left: auto;
  font-size: var(--fs-small);
}

.error-message {
  color: var(--danger-color);
}

.success-box {
  background-color: var(--green-light);
  padding: 1rem;
  border-radius: 5px;
  color: var(--green-dark);
  font-weight: bold;
  text-align: center;
}

@media (min-width: 500px) {
  .form-group {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .form-description {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
