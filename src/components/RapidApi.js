import React,{useEffect} from 'react'

function RapidApi() {
    const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2JiYWMwOTMwZWY4Yzk4ZWE2MmZjOTRmYjEzNzc5ZiIsIm5iZiI6MTczNzI4MDMzMy41NTYsInN1YiI6IjY3OGNjYjRkOGJjYTY2MWQwNTQzMzQzMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0CsTIYoWm5MqJhYa0uGhYIgE-17K82RKNujOC_Hp8oM'
    }
};
    const getMovie=()=>{
        fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json.results))
        .catch(err => console.error(err));
    }

    useEffect(()=>{
        getMovie()
    },[])
  return (
    <div>RapidApi</div>
  )
}

export default RapidApi