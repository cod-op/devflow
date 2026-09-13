import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Planning", "Active", "Completed"],
      default: "Planning",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;