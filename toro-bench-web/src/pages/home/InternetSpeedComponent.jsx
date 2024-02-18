import { useState } from 'react';
import { ReactInternetSpeedMeter } from 'react-internet-meter'


export const SpeedTestComponent = () => {

    const [speed, setSpeed] = useState("0.0");


    return (
        <div>
            <ReactInternetSpeedMeter
                txtSubHeading="Checking the speed"
                outputType="empty"
                customClassName={null}
                txtMainHeading="Opps..."
                pingInterval={1000 * 15} // milliseconds
                thresholdUnit="megabyte" // "byte" , "kilobyte", "megabyte"
                threshold={100}
                imageUrl="https://sample-videos.com/img/Sample-jpg-image-30mb.jpg"
                downloadSize="30789588" //bytes
                callbackFunctionOnNetworkDown={speed =>
                    console.log(`Internet speed is down ${speed}`)
                }
                callbackFunctionOnNetworkTest={speed => {
                    setSpeed(speed);
                    console.log(`Internet speed is test ${speed}`)
                }}
            />
            <h2>Down Speed {speed} mb</h2>
        </div>
    );
}