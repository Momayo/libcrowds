<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Reset API Key"
      :form="form"
      @success="updateCurrentUser">
    </pybossa-form>
  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import PybossaForm from '@/components/forms/PybossaForm'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'account-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'API Settings',
      description: `Reset your ${localConfig.brand} API Key.`
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/account/${params.name}/resetapikey`
    return app.$axios.$get(endpoint).then(data => {
      return {
        csrf: data.form.csrf
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    /**
     * Return the form data.
     */
    form () {
      return {
        endpoint: `account/${this.currentUser.name}/resetapikey`,
        method: 'post',
        model: {
          csrf: this.csrf,
          api_key: this.currentUser.api_key
        },
        schema: {
          fields: [
            {
              model: 'api_key',
              label: 'API Key',
              type: 'input',
              inputType: 'text',
              readonly: true
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
    }
  }
}
</script>
