process.env.PORT = process.env.PORT || 5000;
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

if (process.env.NODE_ENV === "dev") {
  process.env.URLDB =
    "mongodb+srv://admin:admin1234@arkusnexus.5ihjp.mongodb.net/ArkusNexus?retryWrites=true&w=majority";
  // "mongodb://localhost:27017/arkusnexus"
} else {
  process.env.URLDB =
    "mongodb+srv://admin:admin1234@arkusnexus.5ihjp.mongodb.net/ArkusNexus?retryWrites=true&w=majority";
  // "mongodb://localhost:27017/arkusnexus"
}

process.middlewares = [];
