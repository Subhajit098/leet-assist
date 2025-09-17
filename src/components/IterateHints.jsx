import React from 'react'

export default function IterateHints(props) {
  return (
    <div>
        {props.data.map((hint,index)=>{
           return <p key={index}>{hint}</p>
        })}
    </div>
  )
}
