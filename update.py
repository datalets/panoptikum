from dataflows import Flow, load, dump_to_path, dump_to_zip, printer, add_metadata
from dataflows import sort_rows, filter_rows, find_replace, delete_fields, set_type, validate, unpivot




def WERKVERZEICHNIS_csv():
    flow = Flow(
        # Load inputs
        # load('input/WERKVERZEICHNIS_ohne W.xlsx', format='xlsx', ),
        load('input/WERKVERZEICHNIS.csv', format='csv', ),
        # Process them (if necessary)
        # ...
        # Save the results
        add_metadata(name='Werkverzeichnis-JStraumann', title='''Werkverzeichnis Jürg Straumann'''),
        # printer(),
        dump_to_path('data'),
    )
    flow.process()


if __name__ == '__main__':
    WERKVERZEICHNIS_csv()
