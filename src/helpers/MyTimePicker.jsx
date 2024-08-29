import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MaskedTextInput from "react-text-mask";

function MyTimePicker(props) {
  return (
    <div>
      <DatePicker
        customInput={
          <MaskedTextInput
            mask={[/\d/, /\d/, ":", /\d/, /\d/, ":", /\d/, /\d/]}
          />
        }
        {...props}
        //  / showMonthDropdown
        // showYearDropdown
      />
    </div>
  );
}

export { MyTimePicker };
