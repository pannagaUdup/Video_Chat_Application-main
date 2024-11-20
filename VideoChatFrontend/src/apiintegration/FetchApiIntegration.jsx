import axios from 'axios';
import React, { useState, useEffect } from 'react'

const FetchApiIntegration = () => {
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     fetch("https://jsonplaceholder.typicode.com/posts")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             setData((previousData) => [...previousData, ...json]);
    //         })
    //         .catch((error) => console.error("Error fetching data:", error)); 
    // }, []);

    const fetchAxio = async() => {
       await axios.get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
            setData((previousData) => [...previousData, ...response.data]);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    useEffect(() => {
        fetchAxio();
    }, []);

    return (
        <div style={{ width: "100%", height: "96vh", display: "flex", flexWrap: "wrap", gap: "20px", overflowY: "auto", overflowX: "none", justifyContent: "space-around", alignItems: "center", backgroundColor: "#DCBFFF", paddingTop: "20px" }}>
        {
            data?.map((value, index) => {
                return(
                    <div key={value?.userId + value?.id + value?.title} style={{ width: "30%", height: "40%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "10px", backgroundColor: "#E7FBE6"}}>
                        {
                            Object.entries(value)?.map(([key, value]) => {
                                return(
                                   <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
                                        <div style={{ color: "black", fontWeight: "600"}}>{key}:&nbsp;</div>
                                        <div style={{ color: "#6482AD", fontWeight: "bold", overflowY: "auto" }}>{value}</div>
                                    </div>
                                )
                            })
                        }

                    </div>
                )
            })
        }
        </div>
    )
}

export default FetchApiIntegration