const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const MAVSDK_ACTION_PROTO_PATH = __dirname + '/../MAVSDK-Proto/protos/action/action.proto';
console.log(MAVSDK_ACTION_PROTO_PATH);
const ACTION_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_ACTION_PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });


var MAVSDK_TELEMETRY_PROTO_PATH = __dirname + '/../MAVSDK-Proto/protos/telemetry/telemetry.proto';
console.log(MAVSDK_TELEMETRY_PROTO_PATH);
const TELEMTRY_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_TELEMETRY_PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const GRPC_HOST_NAME="127.0.0.1:50000";

class MAVSDKDrone {

    constructor(){
        this.Action = grpc.loadPackageDefinition(ACTION_PACKAGE_DEFINITION).mavsdk.rpc.action;
        this.ActionClient = new this.Action.ActionService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.Telemetry = grpc.loadPackageDefinition(TELEMTRY_PACKAGE_DEFINITION).mavsdk.rpc.telemetry;
        this.TelemetryClient = new this.Telemetry.TelemetryService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.position = {} // Initialize to an empty object
        this.attitudeEuler = {} // Initialize to an empty object
        this.heading = {}
        this.SubscribeToGps()
        this.SubscribeToAttitudeEuler()
        this.SubscribeToHeading()
    }


    Arm()
    {
        this.ActionClient.arm({}, function(err, actionResponse){
            if(err){
                console.log("Unable to arm drone: ", err);
                return;
            }
        });
    }

    Disarm()
    {
        this.ActionClient.disarm({}, function(err, actionResponse){
            if(err){
                console.log("Unable to disarm drone: ", err);
                return;
            }
        });
    }

    Takeoff()
    {
        this.ActionClient.takeoff({}, function(err, actionResponse){
            if(err){
                console.log("Unable to disarm drone: ", err);
                return;
            }
        });
    }

    Land()
    {
        this.ActionClient.land({}, function(err, actionResponse){
            if(err){
                console.log("Unable to land drone: ", err);
                return;
            }
        });
    }

    Goto(longitude_deg, latitude_deg, altitude_m, yaw_deg)
    {
        this.ActionClient.GotoLocation({
            latitude_deg: parseFloat(latitude_deg),
            longitude_deg: parseFloat(longitude_deg),
            absolute_altitude_m: parseFloat(altitude_m),
            yaw_deg: parseFloat(yaw_deg)
        }, function(err, actionResponse){
            console.log(actionResponse);
            if(err){
                console.log("Unable to go to: ", err);
                return;
            }
        });
    }

    SubscribeToGps()
    {
        const self = this;

        this.GpsCall = this.TelemetryClient.subscribePosition({});

        this.GpsCall.on('data', function(gpsInfoResponse){
            self.position = gpsInfoResponse.position
            return; 
        });

        this.GpsCall.on('end', function() {
            console.log("SubscribePosition request ended");
            return;
        });

        this.GpsCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.GpsCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToAttitudeEuler()
    {
        const self = this;

        this.AttitudeEulerCall = this.TelemetryClient.subscribeAttitudeEuler({});

        this.AttitudeEulerCall.on('data', function(attitudeEulerResponse){
            self.attitudeEuler = attitudeEulerResponse.attitude_euler
            return; 
        });

        this.AttitudeEulerCall.on('end', function() {
            console.log("SubscribeAttitudeEuler request ended");
            return;
        });

        this.AttitudeEulerCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.AttitudeEulerCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToHeading()
    {
        const self = this;

        this.HeadingCall = this.TelemetryClient.subscribeHeading({});

        this.HeadingCall.on('data', function(headingResponse){
            self.heading = headingResponse.heading_deg
            return; 
        });

        this.HeadingCall.on('end', function() {
            console.log("SubscribeHeading request ended");
            return;
        });

        this.HeadingCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.HeadingCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
}

module.exports = MAVSDKDrone;