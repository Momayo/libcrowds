const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  brand: 'LibCrowds',
  tagline: 'Crowdsourcing projects from the British Library',
  description: 'LibCrowds is a platform for hosting experimental ' +
               'crowdsourcing projects aimed at improving access to the ' +
               'diverse collections held at the British Library.',
  company: 'The British Library',
  contact: {
    twitter: 'LibCrowds',
    email: 'crowdsourcing@bl.uk'
  },
  githubUrl: 'https://github.com/LibCrowds',
  pybossaHost: isDev ? 'http://127.0.0.1:5000' : 'http://xxxx.com',
  dataLicense: {
    name: 'CC0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  forumUrl: 'http://community.libcrowds.com'
}
