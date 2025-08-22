import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './api';

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    encrypted: false,
    enabledTransports: ['ws'],
    disableStats: true,

    authorizer: (channel) => {
        return {
            authorize: (socketId, callback) => {
                api.post("/api/broadcasting/auth", {
                    socket_id: socketId,
                    channel_name: channel.name,
                })
                    .then((response) => {
                        callback(false, response.data);
                    })
                    .catch((error) => {
                        console.debug("error: ", +error.data);
                        callback(false, error);
                    });
            },
        };
    },
});