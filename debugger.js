var debug_on;
// debug_on checks whether run line by line or run to next breakpoint

var debugger_result;
var debugger_marker;


/*
  Function relating to RUN in the DEMO
  Parse and evaluating the code. Also Send the interpreter the breakpoints.
  Initialize debug mode is off (have not reached any breakpoint)
*/
function make_debugger(code, _breakpoints) {
	debug_on = false;
	debugger_marker = null;
	return run(code, _breakpoints);	
}

/*
	Function dealing with how the debugger run.
	If there is no breakpoint, then it will execute the whole program (run the generator until it finish)
	Else it will stop there and wait for the next call (NEXT BUTTON)
*/
function debugger_next(_debugger) {	
	let temp = _debugger.next();
	console.log(temp.value);
	if (debugger_marker != null) editor.session.removeMarker(debugger_marker);
	if (!temp.done) {
		if (debug_on) {
			// debugger is currently run line by line.
			debugger_result = temp.value;
            debugger_marker = editor.session.addMarker(new Range(line_to_mark(), 0, line_to_mark(), 1), "myMarker", "fullLine");
			variables_table();
			return debugger_result;
		} else {
			//debugger is running either from the beginning (RUN BUTTON) or run to the next breakpoint (RESUME BUTTON)
			while (debug_on == false && !temp.done) {
				if (check_current_line()) {
					debug_on = true;
					on_debug();
					debugger_marker = editor.session.addMarker(new Range(line_to_mark(), 0, line_to_mark(), 1), "myMarker", "fullLine");
					debugger_result = temp.value;
					variables_table();
					return debugger_result;
				} else {
					debugger_result = temp.value; 
					temp = _debugger.next();
				}
			}
		}
	}
	if (temp.done) {
		if (temp.value != undefined) {
			debugger_result = temp.value; 
		}
		variables_table();
		console.log(debugger_result);
		return debugger_result;
	}
}
	
function watch(_variable) {
	console.log("WATCH");
	return check_variable(_variable);
}

function line_to_mark() {
	return get_current_line();	
}

get_current_val = function() {
	return debugger_result;
}

function on_debug() {
    debug_on = true;
}

function off_debug() {
    debug_on = false;
}
function variables_table() {
                let variables = head(get_current_env());
                let var_table = document.getElementById("variables");
                var_table.innerHTML = "";
                let table_row;
                let var_name;
                let var_value;
                let name_td;
                let value_td;
                for(let x in variables) {
                    table_row = document.createElement("tr");

                    name_td = document.createElement("td");
                    value_td = document.createElement("td");

                    var_name = document.createTextNode(x);
                    var_value = document.createTextNode(variables[x]);

                    name_td.appendChild(var_name);
                    value_td.appendChild(var_value);

                    table_row.appendChild(name_td);
                    table_row.appendChild(value_td);

                    var_table.appendChild(table_row);
                }
            }
