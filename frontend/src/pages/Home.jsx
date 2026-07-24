import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Home(){

return(

<>

<Sidebar/>

<Navbar/>

<div
style={{
marginLeft:"260px",
padding:"30px"
}}
>

<h1>

Dashboard Overview

</h1>

<div className="cards">

<StatCard
title="Total Machines"
value="3"
color="#2563eb"
/>

<StatCard
title="Alerts"
value="1"
color="red"
/>

<StatCard
title="Healthy"
value="2"
color="green"
/>

<StatCard
title="Today's Readings"
value="18"
color="orange"
/>

</div>

</div>

</>

);

}

export default Home;