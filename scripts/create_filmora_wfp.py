import os
import json
import uuid
import base64
import zipfile
import shutil

# Paths
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
ELEMENTS_DIR = os.path.join(BASE_DIR, 'elements')
AUDIO_PATH = os.path.join(BASE_DIR, 'public', 'assets', 'audio', 'prestige-1.wav')

# Filmora time unit: 1 second = 10,000,000 units (100ns ticks)
TIME_SCALE = 10000000

def to_filmora_units(sec):
    return int(round(sec * TIME_SCALE))

def new_guid():
    return f"{{{str(uuid.uuid4()).upper()}}}"

def new_uid():
    # 36 char lowercase uuid like "c0f18380-e9c6-f111-9803-3cf86220e922"
    return str(uuid.uuid4()).lower()

def b64_str(s):
    return base64.b64encode(s.encode('utf-8')).decode('ascii')

def b64_guid_padded(guid_str):
    # Filmora pads the 38-char guid {GUID} with zeros to 64 bytes
    b = guid_str.encode('ascii')
    padded = b + b'\x00' * (64 - len(b))
    return base64.b64encode(padded).decode('ascii')

# Element definitions with exact project timings & positions
# Canvas: 1080 x 1920 (9:16)
elements_data = [
    {
        'file': '12_starfield_background_loop.gif',
        'name': 'Background Starfield Loop',
        'width': 1080,
        'height': 1920,
        'start_sec': 0.0,
        'duration_sec': 33.72,
        'track': 0, # Video Track 1 (bottom layer)
        'pos_x': 0.5,
        'pos_y': 0.5,
        'scale': 100.0,
        'loop': True
    },
    {
        'file': '01_top_header.gif',
        'name': 'Top Header (MOVIES YOU HAVE TO WATCH)',
        'width': 1080,
        'height': 140,
        'start_sec': 0.0,
        'duration_sec': 8.0,
        'track': 1,
        'pos_x': 0.50,
        'pos_y': 0.061,
        'scale': 100.0
    },
    {
        'file': '02_arabic_hook.gif',
        'name': 'Arabic Hook ("فلم ؟")',
        'width': 400,
        'height': 240,
        'start_sec': 0.1,
        'duration_sec': 2.45,
        'track': 2,
        'pos_x': 0.50,
        'pos_y': 0.203,
        'scale': 100.0
    },
    {
        'file': '04_avatar_astronaut_entrance_exit.gif',
        'name': 'Astronaut Guide (Walk & Exit)',
        'width': 960,
        'height': 960,
        'start_sec': 0.1,
        'duration_sec': 2.65,
        'track': 3,
        'pos_x': 0.35,
        'pos_y': 0.58,
        'scale': 100.0
    },
    {
        'file': '05_nolan_polaroid_card.gif',
        'name': 'Nolan Polaroid Card',
        'width': 500,
        'height': 620,
        'start_sec': 1.4,
        'duration_sec': 7.0,
        'track': 4,
        'pos_x': 0.50,
        'pos_y': 0.26,
        'scale': 100.0
    },
    {
        'file': '06_iconic_films_heading.gif',
        'name': 'Heading ("ICONIC FILMS")',
        'width': 960,
        'height': 140,
        'start_sec': 4.53,
        'duration_sec': 3.67,
        'track': 5,
        'pos_x': 0.50,
        'pos_y': 0.434,
        'scale': 100.0
    },
    {
        'file': '07_card_interstellar_flip.gif',
        'name': 'Interstellar 2014 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 2.88,
        'duration_sec': 5.5,
        'track': 6,
        'pos_x': 0.184,
        'pos_y': 0.622,
        'scale': 100.0
    },
    {
        'file': '08_card_inception_flip.gif',
        'name': 'Inception 2010 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 3.0,
        'duration_sec': 5.5,
        'track': 7,
        'pos_x': 0.500,
        'pos_y': 0.622,
        'scale': 100.0
    },
    {
        'file': '09_card_the_odyssey_flip.gif',
        'name': 'The Odyssey 2026 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 3.12,
        'duration_sec': 5.5,
        'track': 8,
        'pos_x': 0.816,
        'pos_y': 0.622,
        'scale': 100.0
    },
    {
        'file': '11_ending_tagline.gif',
        'name': 'Tagline ("MANY STORIES. ONE VISION.")',
        'width': 1040,
        'height': 180,
        'start_sec': 6.5,
        'duration_sec': 3.0,
        'track': 9,
        'pos_x': 0.50,
        'pos_y': 0.869,
        'scale': 100.0
    },
    {
        'file': '13_cinematic_insert_blackhole.gif',
        'name': 'Insert Shot 1 (Gargantua Black Hole)',
        'width': 960,
        'height': 660,
        'start_sec': 9.27,
        'duration_sec': 1.0,
        'track': 10,
        'pos_x': 0.50,
        'pos_y': 0.591,
        'scale': 100.0
    },
    {
        'file': '14_cinematic_insert_folding_city.gif',
        'name': 'Insert Shot 2 (Paris Folding City)',
        'width': 960,
        'height': 660,
        'start_sec': 10.27,
        'duration_sec': 1.0,
        'track': 11,
        'pos_x': 0.50,
        'pos_y': 0.591,
        'scale': 100.0
    }
]

def generate_project(output_wfp_path):
    project_guid = new_guid()
    timeline_guid = new_guid()
    now_ts = 1791890000

    temp_dir = os.path.join(BASE_DIR, 'scratch', 'filmora_temp_build')
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir, exist_ok=True)

    proj_folder = os.path.join(temp_dir, 'ProjectFolder')
    medias_folder = os.path.join(proj_folder, 'Medias')
    anon_folder = os.path.join(proj_folder, 'Anon', 'AppData', 'Windows')
    os.makedirs(anon_folder, exist_ok=True)
    os.makedirs(medias_folder, exist_ok=True)

    # 1. functionExtraData.json
    with open(os.path.join(anon_folder, 'functionExtraData.json'), 'w') as f:
        f.write('{"9":"3"}')

    # 2. project_info.json
    project_info = {
        "vbl_modify_version": "8.5.1.3",
        "vbl_create_version": "8.5.1.3",
        "project_os_name": "Windows",
        "project_os_version": "",
        "project_file_name": os.path.splitext(os.path.basename(output_wfp_path))[0],
        "project_file_suffix": ".wfp",
        "project_editor_name": "Filmora",
        "project_editor_create_version": "15.5.3.19727",
        "project_editor_modify_version": "15.5.3.19727",
        "project_date_create": now_ts,
        "project_date_modify": now_ts,
        "project_timeline_duration": to_filmora_units(33.72),
        "project_current_position": 0,
        "project_timeline_framerate": [30, 1],
        "project_timeline_resolution": [1080, 1920],
        "project_timeline_ratio": [9, 16],
        "project_color_space": 0,
        "project_sample_rate": 44100,
        "project_audio_bitdepth": 1,
        "project_player_quality": 0,
        "project_player_zoom_level": 0,
        "project_player_safe_zone": False,
        "project_archive": False,
        "project_storage": True,
        "project_backup": False,
        "project_cover": False,
        "project_custom_cover": False,
        "project_type": 0,
        "bRemoveProjectTypeForArchive": False,
        "bRemoveProjectTypeForSaveAs": False,
        "project_template_name": "",
        "timeline_mediaId": timeline_guid,
        "project_guid": project_guid,
        "proj_zip_save_path": output_wfp_path.replace('\\', '/'),
        "nSizeRatioType": 0,
        "project_source": "83c85a3c10116fb18fc10cdba221148e",
        "project_used_pack_list": [],
        "user_data": [
            {"key": 1, "data": "1"},
            {"key": 2, "data": ""}
        ]
    }
    with open(os.path.join(proj_folder, 'project_info.json'), 'w') as f:
        json.dump(project_info, f, indent=4)

    # Media items map & resources for timeline
    media_items = {}
    resources = []
    media_clips_map = {}

    # Audio Media (prestige-1.wav)
    audio_media_id = new_guid()
    audio_source_uuid = new_uid()
    audio_abs_path = AUDIO_PATH.replace('\\', '/')
    audio_dur_units = to_filmora_units(33.72)

    media_items[audio_media_id] = {
        "download_url": audio_abs_path,
        "id": audio_media_id,
        "media_type": 4, # Audio
        "media_length": audio_dur_units,
        "name": "prestige-1",
        "mediaCreationInfo": '{"creationType":0}',
        "import_time": now_ts,
        "src_md5": "d41d8cd98f00b204e9800998ecf8427e",
        "stream_idx": 0,
        "mark_info_list": [{"mark_in": -1, "mark_out": -1}],
        "scence_info": []
    }

    resources.append({
        "AIGCMeta": {"data": "", "size": 0},
        "alphaPremultiply": 0,
        "audStreamInfo": [
            {
                "audLang": "",
                "audStreamId": 0,
                "bitDepth": 16,
                "bitRate": 1536000,
                "bytesPerSecond": 192000,
                "channels": 2,
                "description": "Uncompressed PCM",
                "duration": 33.72,
                "fourCC": 541934416,
                "layout": 0,
                "sampleRate": 48000,
                "streamLength": audio_dur_units
            }
        ],
        "audioStreamCount": 1,
        "bitRate": 1536000,
        "createDate": now_ts,
        "filename": f"file:/{audio_abs_path}",
        "fourCC": 7758199,
        "mediaLength": audio_dur_units,
        "modifyDate": now_ts,
        "programCount": 1,
        "sourceUuid": audio_source_uuid,
        "streamType": 3,
        "subPicStreamCount": 0,
        "videoStreamCount": 0
    })

    # Prepare each Element GIF
    elements_with_meta = []
    for item in elements_data:
        media_id = new_guid()
        source_uuid = new_uid()
        gif_path = os.path.join(ELEMENTS_DIR, item['file']).replace('\\', '/')
        item_dur_units = to_filmora_units(item['duration_sec'])
        file_size = os.path.getsize(os.path.join(ELEMENTS_DIR, item['file'])) if os.path.exists(os.path.join(ELEMENTS_DIR, item['file'])) else 1000000

        # Save media.json in Medias/{media_id}/
        item_media_dir = os.path.join(medias_folder, media_id)
        os.makedirs(item_media_dir, exist_ok=True)
        media_json_content = {
            "version": "1.1.7",
            "file_name": gif_path,
            "sourceInfo": {
                "basicInfo": {
                    "streamType": 2,
                    "fourCC": 6711655,
                    "mediaLength": item_dur_units,
                    "programCount": 1,
                    "videoStreamCount": 1,
                    "audioStreamCount": 0,
                    "subPicStreamCount": 0,
                    "bitRate": 1000000,
                    "createDate": now_ts
                },
                "vidStreamInfos": [
                    {
                        "vidStreamId": 0,
                        "fourCC": 543582567,
                        "streamLength": item_dur_units,
                        "bitRate": 1000000,
                        "startTimestamp": 0,
                        "timestampOffset": 0,
                        "videoScanType": 2,
                        "width": item['width'],
                        "height": item['height'],
                        "frameRate": {"den": 1, "num": 30},
                        "maxFrameRate": {"den": 1000, "num": 30000},
                        "totalFrames": int(item['duration_sec'] * 30),
                        "xRatio": item['width'],
                        "yRatio": item['height'],
                        "rotation": 0,
                        "flipType": 0,
                        "gpsLatitude": 0.0,
                        "gpsLongitude": 0.0,
                        "cameraMaker": "None",
                        "cameraModel": "None",
                        "exposureTime": 0.0,
                        "premultiAlphaTypePhoto": -1,
                        "transferCharacteristics": 0,
                        "maxGopSize": 1,
                        "lastframeRate": {"den": 1, "num": 30},
                        "alphaChannel": 1,
                        "isDolbyVision": 0,
                        "colorSpaceSource": 0
                    }
                ],
                "recordInfos": {}
            }
        }
        with open(os.path.join(item_media_dir, 'media.json'), 'w') as f:
            json.dump(media_json_content, f)

        # medias_info.json item
        media_items[media_id] = {
            "download_url": gif_path,
            "id": media_id,
            "media_type": 2, # GIF / Video
            "media_length": item_dur_units,
            "name": os.path.splitext(item['file'])[0],
            "mediaCreationInfo": '{"creationType":0}',
            "import_time": now_ts,
            "src_md5": "d41d8cd98f00b204e9800998ecf8427e",
            "stream_idx": -1,
            "mark_info_list": [{"mark_in": -1, "mark_out": -1}],
            "scence_info": []
        }

        # timeline.wesproj resource
        resources.append({
            "AIGCMeta": {"data": "", "size": 0},
            "alphaPremultiply": 0,
            "audioStreamCount": 0,
            "bitRate": 1000000,
            "createDate": now_ts,
            "filename": f"file:/{gif_path}",
            "fourCC": 6711655,
            "mediaLength": item_dur_units,
            "modifyDate": now_ts,
            "programCount": 1,
            "sourceUuid": source_uuid,
            "streamType": 2,
            "subPicStreamCount": 0,
            "vidStreamInfo": [
                {
                    "FNumber": 0,
                    "FocalLength": 0,
                    "ISO": 0,
                    "ViewsCount": 1,
                    "alphaChannel": 1,
                    "artist": "",
                    "bitRate": 1000000,
                    "bitsDepth": 24,
                    "cameraLensMaker": "",
                    "cameraLensModel": "",
                    "cameraMaker": "",
                    "cameraModel": "",
                    "colorChromesubsampling": 0,
                    "colorPrimary": 0,
                    "colorRange": 0,
                    "colorSpace": 0,
                    "colorSpaceSource": 0,
                    "colorTemperature": 0,
                    "dateTimerOriginal": "",
                    "exposureTime": 0,
                    "flipType": 0,
                    "fourCC": 543582567,
                    "frameRate": {"den": 1, "num": 30},
                    "gpsAltitude": 0,
                    "gpsLatitude": 0,
                    "gpsLongitude": 0,
                    "height": item['height'],
                    "isDolbyVision": 0,
                    "matrixCoefficients": 0,
                    "maxFrameRate": {"den": 1000, "num": 30000},
                    "maxGopSize": 1,
                    "proresRawISO": 0,
                    "rotation": 0,
                    "startTimestamp": 0,
                    "streamLength": item_dur_units,
                    "timestampOffset": 0,
                    "totalFrames": int(item['duration_sec'] * 30),
                    "transferCharacteristics": 0,
                    "vidStreamId": 0,
                    "videoScanType": 2,
                    "width": item['width'],
                    "xRatio": item['width'],
                    "yRatio": item['height']
                }
            ],
            "videoStreamCount": 1
        })

        item_copy = dict(item)
        item_copy['media_id'] = media_id
        item_copy['source_uuid'] = source_uuid
        item_copy['abs_path'] = gif_path
        elements_with_meta.append(item_copy)

    # 3. medias_info.json
    medias_info = {
        "media_structure": {
            "visible": "true",
            "SerializeDataOnlyProjectUsered": "false",
            "Folder": {
                "visible": "true",
                "SerializeDataOnlyProjectUsered": "false",
                "media_item": list(media_items.keys())
            },
            "media_item": timeline_guid
        },
        "media_items": media_items
    }
    with open(os.path.join(medias_folder, 'medias_info.json'), 'w') as f:
        json.dump(medias_info, f)

    # Build timeline tracks
    # Track 0: Audio Track
    # Tracks 1..N: Video Tracks for elements
    track_infos = []

    # Audio Track
    audio_clip_guid = new_guid()
    audio_clip_uid = new_uid()
    media_clips_map[audio_clip_guid] = {"mediaId": audio_media_id, "subClips": {}}

    audio_clip = {
        "audioDuckingframe": {"parameter": '{"Version": 3,"ParameterType": 0,"keyframeSets": [],"MD5":"d41d8cd98f00b204e9800998ecf8427e"}'},
        "audio_cloud_algorithm": {"info": [{"type": "audio"}], "version": 1},
        "denoiseV3Strength": 50.0,
        "effectChainList": [
            {"effectList": [], "name": "Basic"},
            {"effectList": [], "name": "BasicFollow"},
            {"effectList": [], "name": "Effect"},
            {"effectList": [], "name": "_wes_hold_effectchain_"}
        ],
        "filename": f"file:/{audio_abs_path}",
        "inPoint": 0,
        "outPoint": audio_dur_units,
        "placeholder": False,
        "placeholderStatus": 0,
        "sourceUuid": audio_source_uuid,
        "speed": {
            "offset": 0,
            "offsetEnd": 33.72,
            "reverse": False,
            "speedParam": f'{{"Version": 3,"ParameterType": 0,"keyframeSets": [{{"_time": 0.0,"Interpolation": 6,"_value": 1.0}},{{"_time": 33.72,"Interpolation": 6,"_value": 1.0}}],"MD5": "58a4cafd1d81f2fcd4a63e3662d40c00","_totalTime": 33.72}}'
        },
        "streamId": 0,
        "thisUId": audio_clip_uid,
        "tlBegin": 0,
        "tlEnd": audio_dur_units,
        "type": 2, # Audio
        "userData": [
            {"data": "AAAAAA==", "key": 102, "size": 4},
            {"data": "DgAAAA==", "key": 6, "size": 4},
            {"data": "BAAAAA==", "key": 103, "size": 4},
            {"data": b64_str(audio_media_id), "key": 10, "size": 38},
            {"data": "AAAAAA==", "key": 2, "size": 4},
            {"data": b64_str("prestige-1"), "key": 50, "size": 10},
            {"data": "AgAAAA==", "key": 1, "size": 4},
            {"data": b64_guid_padded(audio_clip_guid), "key": 3, "size": 64},
            {"data": "MQ==", "key": 13006, "size": 1}
        ],
        "volumeKeyframe": {"parameter": '{"Version": 3,"ParameterType": 0,"keyframeSets": [],"MD5":"d41d8cd98f00b204e9800998ecf8427e"}'}
    }

    track_infos.append({
        "busUuids": ["94b2b4d7-20c6-f111-9803-3cf86220e922"],
        "clipList": [audio_clip],
        "trackType": 2 # Audio
    })

    # Group video elements by track
    max_track_idx = max(el['track'] for el in elements_with_meta)
    for track_i in range(max_track_idx + 1):
        items_on_track = [el for el in elements_with_meta if el['track'] == track_i]
        clip_list = []

        for item in items_on_track:
            clip_guid = new_guid()
            clip_uid = new_uid()
            media_clips_map[clip_guid] = {"mediaId": item['media_id'], "subClips": {}}

            start_units = to_filmora_units(item['start_sec'])
            dur_units = to_filmora_units(item['duration_sec'])
            end_units = start_units + dur_units

            crop_uid = new_uid()
            transform_uid = new_uid()

            # Transform params for accurate screen placement
            param_list = [
                {"fxParam": {"paramType": 5, "unValue": 1186339}, "name": "dwValue"},
                {"fxParam": {"paramType": 3, "unValue": item['scale']}, "name": "Scale_x"},
                {"fxParam": {"paramType": 3, "unValue": item['scale']}, "name": "Scale_y"},
                {"fxParam": {"paramType": 3, "unValue": item['pos_x']}, "name": "Position_x"},
                {"fxParam": {"paramType": 3, "unValue": item['pos_y']}, "name": "Position_y"}
            ]

            clip_obj = {
                "backgroundFillBluredness": 20,
                "effectChainList": [
                    {
                        "effectList": [
                            {
                                "display": "crop-pan-zoom",
                                "id": "video/effect/crop-pan-zoom",
                                "placeholder": False,
                                "placeholderStatus": 0,
                                "thisUId": crop_uid,
                                "type": 3,
                                "userData": [
                                    {"data": b64_guid_padded(new_guid()), "key": 3, "size": 64},
                                    {"data": "AQ==", "key": 7, "size": 1}
                                ]
                            },
                            {
                                "display": "transform",
                                "id": "video/effect/transform",
                                "paramList": param_list,
                                "placeholder": False,
                                "placeholderStatus": 0,
                                "thisUId": transform_uid,
                                "type": 3,
                                "userData": [
                                    {"data": "MS4w", "key": 15005, "size": 3},
                                    {"data": b64_guid_padded(new_guid()), "key": 3, "size": 64},
                                    {"data": "AQ==", "key": 7, "size": 1},
                                    {"data": "MQA=", "key": 36880, "size": 2}
                                ]
                            }
                        ],
                        "name": "Basic"
                    },
                    {"effectList": [], "name": "Effect"},
                    {"effectList": [], "name": "_wes_hold_effectchain_"}
                ],
                "filename": f"file:/{item['abs_path']}",
                "image_denoise": {"cache_mode": 0, "sigma": 20, "status": 0, "version": 1},
                "inPoint": 0,
                "outPoint": dur_units,
                "picSequence": False,
                "pipBuf": '{"Algorithm":"Bilinear","BlendMode":0,"BlenderName":"video/blender/simple-pip","Enable":true,"Opacity":100.0}',
                "pipBufSize": 110,
                "placeholder": False,
                "placeholderStatus": 0,
                "sourceUuid": item['source_uuid'],
                "speed": {
                    "offset": 0,
                    "offsetEnd": item['duration_sec'],
                    "reverse": False,
                    "speedParam": f'{{"Version": 3,"ParameterType": 0,"keyframeSets": [{{"_time": 0.0,"Interpolation": 6,"_value": 1.0}},{{"_time": {item["duration_sec"]},"Interpolation": 6,"_value": 1.0}}],"MD5": "e42921cced9e4b3df5044318ef6c3219","_totalTime": {item["duration_sec"]}}}'
                },
                "stabilization": {"cache_mode": 0, "smooth": 5, "status": 0, "version": 1},
                "stabilizeAnalysisData": None,
                "streamId": 0,
                "thisUId": clip_uid,
                "tlBegin": start_units,
                "tlEnd": end_units,
                "type": 1, # Video
                "userData": [
                    {"data": "AAAAAA==", "key": 102, "size": 4},
                    {"data": "AgAAAA==", "key": 103, "size": 4},
                    {"data": "AwAAAA==", "key": 1, "size": 4},
                    {"data": b64_str(item['name']), "key": 50, "size": len(item['name'])},
                    {"data": "AAAAAA==", "key": 2, "size": 4},
                    {"data": b64_str(item['media_id']), "key": 10, "size": 38},
                    {"data": b64_guid_padded(clip_guid), "key": 3, "size": 64},
                    {"data": "BQAAAA==", "key": 6, "size": 4}
                ]
            }
            clip_list.append(clip_obj)

        track_infos.append({
            "clipList": clip_list,
            "trackType": 1 # Video
        })

    # 4. timeline.wesproj
    timeline_wesproj = {
        "currentTimelineId": 14,
        "productName": "Filmora",
        "projectName": "TLB",
        "projectVersion": "6, 12, 101, 27",
        "resources": resources,
        "serialNumber": 15,
        "serializationVersion": "28",
        "timelineInfos": [
            {
                "aspectRatioX": 9,
                "aspectRatioY": 16,
                "resolutionWidth": 1080,
                "resolutionHeight": 1920,
                "sampleRate": 44100,
                "timelineId": 14,
                "frameRate": {"den": 1, "num": 30},
                "format": "f32",
                "hdrMode": 0,
                "hdrMode_force_16bit": 0,
                "channels": 2,
                "audioBusInfos": [
                    {
                        "balance": 0.5,
                        "busUid": "94b2b4d7-20c6-f111-9803-3cf86220e922",
                        "gain": 0.0
                    }
                ],
                "trackInfos": track_infos
            }
        ]
    }

    timeline_dir = os.path.join(medias_folder, timeline_guid)
    os.makedirs(timeline_dir, exist_ok=True)
    with open(os.path.join(timeline_dir, 'timeline.wesproj'), 'w') as f:
        json.dump(timeline_wesproj, f)

    # 5. extra.json in timeline dir
    extra_json = {
        "fontNameInfo": [],
        "usedBizFont": [],
        "usedTemplateResInfo": {},
        "mediaClipsMapInfo": media_clips_map,
        "allMarkersInfo": {"beatDetectInfo": {}},
        "pendingMarkersInfo": {},
        "highlightInfo": {},
        "TextSentence": {"TextSentence": []}
    }
    with open(os.path.join(timeline_dir, 'extra.json'), 'w') as f:
        json.dump(extra_json, f)

    # 6. Compress into .wfp ZIP archive
    if os.path.exists(output_wfp_path):
        os.remove(output_wfp_path)

    with zipfile.ZipFile(output_wfp_path, 'w', zipfile.ZIP_DEFLATED) as zip_out:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, temp_dir)
                # ZIP entry names must use forward slashes
                zip_entry = rel_path.replace('\\', '/')
                zip_out.write(full_path, zip_entry)

    shutil.rmtree(temp_dir)
    print(f"[OK] Successfully created Filmora 15.5 project: {output_wfp_path}")
    print(f"  Archive size: {os.path.getsize(output_wfp_path):,} bytes")

if __name__ == '__main__':
    # 1. Save in the project directory
    target_1 = os.path.join(BASE_DIR, 'nolan_prestige_motion_graphics.wfp')
    generate_project(target_1)

    # 2. Also save in elements directory
    target_2 = os.path.join(ELEMENTS_DIR, 'nolan_prestige_motion_graphics.wfp')
    shutil.copy2(target_1, target_2)
    print(f"[OK] Copied to elements directory: {target_2}")

    # 3. Also save in E:\\The Special Content\\ root for easy access
    target_3 = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), 'nolan_prestige_motion_graphics.wfp')
    try:
        shutil.copy2(target_1, target_3)
        print(f"[OK] Copied to workspace root: {target_3}")
    except Exception as e:
        print(f"Note: Could not copy to {target_3}: {e}")
