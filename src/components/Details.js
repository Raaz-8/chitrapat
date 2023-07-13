import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-stars'
import { db } from '../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import Review from './Review';

const Details = () => {

    const {id}=useParams();
    const [data,setData]=useState({
        name:"",
        year:"",
        link:"",
        desc:"",
        rating:0,
        ratedby:0
    });

    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        setLoading(true);
        async function getData(){
            const _doc=doc(db,"movies",id);
            const _data=await getDoc(_doc);
            
            setData(_data.data());
            setLoading(false);
        }
        
        getData();
    },[])

  return (
    <div className='flex flex-col items-center md:flex-row md:items-start justify-center w-full p-4  mt-4'>
    { loading? <div className='h-96 mt-52'><ColorRing
    visible={true}
    height="100"
    width="100"
    ariaLabel="blocks-loading"
    wrapperStyle={{}}
    wrapperClass="blocks-wrapper"
    colors={['#FF0000', '#FF4D4D', '#FF9999', '#FFCCCC', '#FFF5F5']}
  /></div>  : <>
    <img className='detail-img block md:sticky top-24 ' src={data.link}/>
    <div className='ml-4 w-full md:w-1/2'>
    <div className='flex items-center'><h1 className='text-2xl font-semibold text-white-600 '>{data.name} </h1> <h3 className='mt-1 ml-2 text-gray-400'>({data.year})</h3></div>

    <ReactStars className='mb-0.5'
        size={20}
        half={true}
        value={data.rating / data.ratedby}
        edit={false}
        />

        <p className='mt-2 text-gray-400'> {data.desc} </p>
        <Review id={id} prevRating={data.rating} userRated={data.ratedby}/>
    </div>
    </>}
    </div>
  )
}

export default Details