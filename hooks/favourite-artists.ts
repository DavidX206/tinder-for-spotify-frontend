import { useQuery } from "@tanstack/react-query"
import SonderApi from "../api"
import useAccessToken from "./access-token"
import useCurrentUser from "./current-user";
import { FavouriteArtist, FavouriteTrack } from "../types/types";

const useFavouriteArtists = (userId?: string) => {
    const { accessToken } = useAccessToken();
    const { userProfile } = useCurrentUser();

    const { isLoading, data: favouriteArtists } = useQuery({
        queryKey: ['favourite-artists'],
        queryFn: async () => {
            const response = await SonderApi.post('/users/me/top/artists', { user_id: userProfile?.id }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            return response.data.data as FavouriteArtist[]
        },
        enabled: !!accessToken && !!userProfile?.id
    })

    const { isLoading: favouriteArtistsLoading, data: userFavouriteArtists } = useQuery({
        queryKey: ['favourite-artists', userId],
        queryFn: async () => {
            const response = await SonderApi.get(`/users/${userId}/top/artists`)
            return response.data.data as FavouriteArtist[]
        },
        enabled: !!userId
    })


    return {
        isLoading,
        favouriteArtists,

        favouriteArtistsLoading,
        userFavouriteArtists
    }
}

export default useFavouriteArtists;