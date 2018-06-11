let userAccessToken = ''
const clientID = "b2107fd1ef6c427dba6d0771fce5e655"
const redirURI = "http://localhost:3000/"

const Spotify = {
    getAccessToken() {
        if (userAccessToken !== '') {
            return userAccessToken
        }

        const url = window.location.href

        const accessToken = url.match(/access_token=([^&]*)/)
        const expiresIn = url.match(/expires_in=([^&]*)/)

        if(accessToken && expiresIn) {
            userAccessToken = accessToken[1]
            const expirationTime = Number(expiresIn[1])
            window.setTimeout(() => {
                userAccessToken = ''
            }, expirationTime*1000)
            window.history.pushState('Access Token', null, '/')
            return userAccessToken

        }
        else{
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirURI}`
        }
    },

    search(term){
        const accessToken = this.getAccessToken()
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`
        return fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json()).then(jsonResponse => {
            if(!jsonResponse.tracks){
                return []
            }
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        })
    },

    savePlaylist(name, uris){
        if(!name || !uris){
            return;
        }
        const accessToken = this.getAccessToken()
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(response => response.json())
            .then(jsonResponse => jsonResponse.id)
            .then(userId => {
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    body: JSON.stringify({name: name}),
                    method: 'POST'
            }).then(response => response.json())
                .then(jsonResponse => {
                    const playlistId = jsonResponse.id
                    fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                        headers: headers,
                        body: JSON.stringify({uris: uris}),
                        method: 'POST'
                    })
                })
            })
    }
}

export default Spotify