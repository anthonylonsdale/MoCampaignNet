import osmnx as ox
import json

app = Flask(__name__)

def create_graph_from_bbox(north, south, east, west, network_type='drive'):
    G = ox.graph_from_bbox(north, south, east, west, network_type=network_type, simplify=True)
    nodes, edges = ox.graph_to_gdfs(G, nodes=True, edges=True)
    edges_geojson = edges.to_json()
    return edges_geojson

@app.route('/get_graph', methods=['POST'])
def get_graph():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    request_json = request.get_json()
    for key in ['north', 'south', 'east', 'west']:
        if key not in request_json:
            return jsonify({"error": f"Missing {key} parameter"}), 400

    try:
        north = float(request_json['north'])
        south = float(request_json['south'])
        east = float(request_json['south'])
        west = float(request_json['west'])
    except ValueError:
        return jsonify({"error": "Invalid coordinate format"}), 400

    try:
        graph_geojson = create_graph_from_bbox(north, south, east, west)
        return graph_geojson
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if name == 'main':
    # Set debug to False in production
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=False)
