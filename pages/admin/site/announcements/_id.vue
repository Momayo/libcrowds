<template>
  <card-base
    :title="title"
    :description="description"
    docs="/admin/announcements">

    <p slot="guidance">
      Use the form below to update the announcement.
    </p>
    <hr class="my-1">

    <div slot="controls" class="d-flex align-items-center float-right">
      <label class="mr-1 mb-0 toggle-label">
        <strong>Published</strong>
      </label>
      <no-ssr>
        <toggle-button
          :value="form.model.published"
          :sync="true"
          :labels="true"
          class="mb-0"
          @change="togglePublished">
        </toggle-button>
      </no-ssr>
    </div>

    <b-tabs card>
      <b-tab title="Core Details" active no-body>
        <pybossa-form
          submit-text="Update"
          show-cancel
          :form="form"
          @success="onSuccess"
          @cancel="onCancel">
        </pybossa-form>
      </b-tab>
      <b-tab title="Thumbnail" no-body>
        <image-upload-form
          submit-text="Update"
          :endpoint="thumbnailForm.endpoint"
          :model="thumbnailForm.model"
          :method="thumbnailForm.method"
          :current-image-url="currentImageUrl"
          file-field="file">
        </image-upload-form>
      </b-tab>
    </b-tabs>

  </card-base>
</template>

<script>
import localConfig from '@/local.config'
import pick from 'lodash/pick'
import { metaTags } from '@/mixins/metaTags'
import VueFormGenerator from 'vue-form-generator'
import ImageUploadForm from '@/components/forms/ImageUpload'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Update Announcement',
      description: 'Update and publish the announcement.'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/api/announcement/${params.id}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        announcement: data,
        form: {
          endpoint: `/api/announcement/${data.id}`,
          method: 'PUT',
          model: pick(
            data,
            'title',
            'body',
            'published',
            'info'
          ),
          schema: {
            fields: [
              {
                model: 'title',
                label: 'Title',
                type: 'input',
                inputType: 'text',
                hint: 'Short titles work best (e.g. New Project Added!)',
                required: true,
                validator: VueFormGenerator.validators.string
              },
              {
                model: 'body',
                label: 'Content',
                type: 'input',
                inputType: 'text',
                hint: 'Add some additional details',
                required: true,
                validator: VueFormGenerator.validators.string
              },
              {
                model: 'info.url',
                label: 'URL',
                type: 'input',
                inputType: 'url',
                required: true,
                placeholder: 'http://example.com',
                validator: VueFormGenerator.validators.url,
                hint: 'The URL to navigate to when the announcement is clicked'
              }
            ]
          }
        },
        thumbnailForm: {
          endpoint: `/api/announcement/${params.id}`,
          method: 'PUT',
          model: {
            file: null,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          }
        }
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    PybossaForm,
    ImageUploadForm,
    CardBase
  },

  computed: {
    currentImageUrl () {
      const thumbnailUrl = this.announcement.media_url
      if (typeof thumbnailUrl === 'undefined' || thumbnailUrl === null) {
        return ''
      } else if (thumbnailUrl.indexOf('/uploads') === 0) {
        return localConfig.pybossaHost + thumbnailUrl
      }
      return thumbnailUrl
    }
  },

  methods: {
    /**
     * Handle cancel.
     */
    onCancel () {
      this.$router.push({ name: 'admin-site-announcements' })
    },

    /**
     * Handle success.
     * @param {Object} data
     *   The response data.
     */
    onSuccess (data) {
      this.$notifications.success({ message: 'Announcement updated' })
      this.$router.push({
        name: 'admin-site-announcements'
      })
    },

    /**
     * Publish or unpublish an announcement.
     * @param {Object} project
     *   The project.
     */
    togglePublished () {
      this.$axios.$put(`/api/announcement/${this.announcement.id}`, {
        published: !this.form.model.published
      }).then(data => {
        this.form.model.published = !this.form.model.published
        this.$notifications.success({
          message: this.form.model.published
            ? 'Announcement published'
            : 'Announcement unpublished'
        })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
