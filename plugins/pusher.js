import Pusher from 'pusher-js'
import Cookie from 'js-cookie'

export default (context, inject) => {
  const authToken = Cookie.get('auth._token.laravelJWT') || ''
  const { key, cluster } = context.$config.pusher
  const { browserBaseURL } = context.$config.axios
  const options = {
    cluster,
    authEndpoint: `${browserBaseURL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: authToken,
        Accept: 'application/json'
      }
    }
  }

  const pusher = new Pusher(key, options)
  const channel = pusher.subscribe('presence-activities')

  channel.bind('pusher:subscription_error', ({ status }) => {
    // eslint-disable-next-line
    console.log('error subscribing' + status)

    if (status === 401) {
      pusher.config.auth.headers.Authorization = authToken
      channel.subscribe('presence-activities')
    }
  })
  channel.bind('pusher:subscription_succeeded', () => {
    // eslint-disable-next-line
    console.log('subscribed')
  })

  inject('pusher', pusher)
  inject('channel', channel)
}
