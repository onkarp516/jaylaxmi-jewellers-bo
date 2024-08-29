JsonArray breaksArray = new JsonArray();
JsonArray downtimeArray = new JsonArray();
JsonObject taskObject = new JsonObject();
    taskObject.addProperty("taskType", taskView.getTaskType());

downtimeArray.add(taskObject);
breakObject.add("breakList", downtimeArray);
breaksArray.add(breakObject);
jsonObject.add("downtimeData", breaksArray);
