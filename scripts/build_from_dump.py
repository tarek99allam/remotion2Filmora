import os
import json
import uuid
import base64
import zipfile
import shutil

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DUMP_WFP = os.path.join(BASE_DIR, 'dump file.wfp')
ELEMENTS_DIR = os.path.join(BASE_DIR, 'elements')
AUDIO_PATH = os.path.join(BASE_DIR, 'public', 'assets', 'audio', 'prestige-1.wav')

TIME_SCALE = 10000000

def to_units(sec):
    return int(round(sec * TIME_SCALE))

def new_guid():
    return f"{{{str(uuid.uuid4()).upper()}}}"

def new_uid():
    return str(uuid.uuid4()).lower()

def b64_str(s):
    return base64.b64encode(s.encode('utf-8')).decode('ascii')

def b64_guid_padded(guid_str):
    b = guid_str.encode('ascii')
    padded = b + b'\x00' * (64 - len(b))
    return base64.b64encode(padded).decode('ascii')

# Timeline elements specifications
timeline_clips_spec = [
    {
        'file': '12_starfield_background_loop.gif',
        'name': 'Background Starfield Loop',
        'width': 1080,
        'height': 1920,
        'start_sec': 0.0,
        'duration_sec': 33.72,
        'pos_x': 0.5,
        'pos_y': 0.5,
        'scale': 100.0,
    },
    {
        'file': '01_top_header.gif',
        'name': 'Top Header (MOVIES YOU HAVE TO WATCH)',
        'width': 1080,
        'height': 140,
        'start_sec': 0.0,
        'duration_sec': 8.0,
        'pos_x': 0.50,
        'pos_y': 0.061,
        'scale': 100.0,
    },
    {
        'file': '02_arabic_hook.gif',
        'name': 'Arabic Hook ("فلم ؟")',
        'width': 400,
        'height': 240,
        'start_sec': 0.1,
        'duration_sec': 2.45,
        'pos_x': 0.50,
        'pos_y': 0.203,
        'scale': 100.0,
    },
    {
        'file': '04_avatar_astronaut_entrance_exit.gif',
        'name': 'Astronaut Guide (Walk & Exit)',
        'width': 960,
        'height': 960,
        'start_sec': 0.1,
        'duration_sec': 2.65,
        'pos_x': 0.35,
        'pos_y': 0.58,
        'scale': 100.0,
    },
    {
        'file': '05_nolan_polaroid_card.gif',
        'name': 'Nolan Polaroid Card',
        'width': 500,
        'height': 620,
        'start_sec': 1.4,
        'duration_sec': 7.0,
        'pos_x': 0.50,
        'pos_y': 0.26,
        'scale': 100.0,
    },
    {
        'file': '06_iconic_films_heading.gif',
        'name': 'Heading ("ICONIC FILMS")',
        'width': 960,
        'height': 140,
        'start_sec': 4.53,
        'duration_sec': 3.67,
        'pos_x': 0.50,
        'pos_y': 0.434,
        'scale': 100.0,
    },
    {
        'file': '07_card_interstellar_flip.gif',
        'name': 'Interstellar 2014 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 2.88,
        'duration_sec': 5.5,
        'pos_x': 0.184,
        'pos_y': 0.622,
        'scale': 100.0,
    },
    {
        'file': '08_card_inception_flip.gif',
        'name': 'Inception 2010 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 3.0,
        'duration_sec': 5.5,
        'pos_x': 0.500,
        'pos_y': 0.622,
        'scale': 100.0,
    },
    {
        'file': '09_card_the_odyssey_flip.gif',
        'name': 'The Odyssey 2026 (3D Flip)',
        'width': 360,
        'height': 600,
        'start_sec': 3.12,
        'duration_sec': 5.5,
        'pos_x': 0.816,
        'pos_y': 0.622,
        'scale': 100.0,
    },
    {
        'file': '11_ending_tagline.gif',
        'name': 'Tagline ("MANY STORIES. ONE VISION.")',
        'width': 1040,
        'height': 180,
        'start_sec': 6.5,
        'duration_sec': 3.0,
        'pos_x': 0.50,
        'pos_y': 0.869,
        'scale': 100.0,
    },
    {
        'file': '13_cinematic_insert_blackhole.gif',
        'name': 'Insert Shot 1 (Gargantua Black Hole)',
        'width': 960,
        'height': 660,
        'start_sec': 9.27,
        'duration_sec': 1.0,
        'pos_x': 0.50,
        'pos_y': 0.591,
        'scale': 100.0,
    },
    {
        'file': '14_cinematic_insert_folding_city.gif',
        'name': 'Insert Shot 2 (Paris Folding City)',
        'width': 960,
        'height': 660,
        'start_sec': 10.27,
        'duration_sec': 1.0,
        'pos_x': 0.50,
        'pos_y': 0.591,
        'scale': 100.0,
    }
]

# Additional elements to include in Media Pool
pool_only_elements = [
    {
        'file': '03_avatar_astronaut_walk_loop.gif',
        'name': 'Astronaut Guide (Looping Walk Cycle)',
        'width': 640,
        'height': 850,
        'duration_sec': 2.0,
    },
    {
        'file': '10_movie_cards_trio.gif',
        'name': 'Movie Cards Trio (All 3 Combined)',
        'width': 1040,
        'height': 620,
        'duration_sec': 6.0,
    }
]

def build_project(output_path):
    stage_dir = os.path.join(BASE_DIR, 'scratch', 'stage_from_dump')
    if os.path.exists(stage_dir):
        shutil.rmtree(stage_dir)
    os.makedirs(stage_dir, exist_ok=True)

    # 1. Extract dump file.wfp as exact native base
    with zipfile.ZipFile(DUMP_WFP, 'r') as z:
        z.extractall(stage_dir)

    proj_folder = os.path.join(stage_dir, 'ProjectFolder')
    medias_folder = os.path.join(proj_folder, 'Medias')

    # Load project_info.json from dump
    proj_info_file = os.path.join(proj_folder, 'project_info.json')
    with open(proj_info_file, 'r', encoding='utf-8') as f:
        proj_info = json.load(f)

    timeline_media_id = proj_info['timeline_mediaId']
    tl_folder = os.path.join(medias_folder, timeline_media_id)

    # Update project_info.json
    proj_info['project_file_name'] = 'nolan_prestige_motion_graphics'
    proj_info['project_timeline_duration'] = to_units(33.72)
    proj_info['proj_zip_save_path'] = output_path.replace('\\', '/')
    proj_info['project_timeline_framerate'] = [30, 1]
    with open(proj_info_file, 'w', encoding='utf-8') as f:
        json.dump(proj_info, f, indent=4)

    # Load medias_info.json
    medias_info_file = os.path.join(medias_folder, 'medias_info.json')
    with open(medias_info_file, 'r', encoding='utf-8') as f:
        medias_info = json.load(f)

    # Load timeline.wesproj
    tl_file = os.path.join(tl_folder, 'timeline.wesproj')
    with open(tl_file, 'r', encoding='utf-8') as f:
        timeline_wesproj = json.load(f)

    tl_info = timeline_wesproj['timelineInfos'][0]
    tl_info['frameRate'] = {"den": 1, "num": 30}
    audio_bus_uid = tl_info['audioBusInfos'][0]['busUid']

    resources = []
    media_clips_map = {}
    media_structure_items = []
    now_ts = proj_info.get('project_date_create', 1791904870)

    # Sample thumbnail from dump file to reuse
    dump_thumb = os.path.join(tl_folder, 'thumbnail.png')

    # 2. Add Audio Media (prestige-1.wav)
    audio_media_id = new_guid()
    audio_source_uuid = new_uid()
    audio_abs_path = AUDIO_PATH.replace('\\', '/')
    audio_dur = to_units(33.72)

    medias_info['media_items'][audio_media_id] = {
        "download_url": audio_abs_path,
        "id": audio_media_id,
        "media_type": 4, # Audio
        "media_length": audio_dur,
        "name": "prestige-1",
        "mediaCreationInfo": '{"creationType":0}',
        "import_time": now_ts,
        "src_md5": "d41d8cd98f00b204e9800998ecf8427e",
        "stream_idx": 0,
        "mark_info_list": [{"mark_in": -1, "mark_out": -1}],
        "scence_info": []
    }
    media_structure_items.append(audio_media_id)

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
                "streamLength": audio_dur
            }
        ],
        "audioStreamCount": 1,
        "bitRate": 1536000,
        "createDate": now_ts,
        "filename": f"file:/{audio_abs_path}",
        "fourCC": 7758199,
        "mediaLength": audio_dur,
        "modifyDate": now_ts,
        "programCount": 1,
        "sourceUuid": audio_source_uuid,
        "streamType": 3,
        "subPicStreamCount": 0,
        "videoStreamCount": 0
    })

    # Audio Track clip
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
        "outPoint": audio_dur,
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
        "tlEnd": audio_dur,
        "type": 2,
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

    # Track 0: Audio Track
    track_infos = [
        {
            "busUuids": [audio_bus_uid],
            "clipList": [audio_clip],
            "trackType": 2,
            "uuid": new_uid()
        }
    ]

    # 3. Add Timeline Elements
    all_video_elements = timeline_clips_spec + pool_only_elements
    media_id_by_filename = {}

    for item in all_video_elements:
        media_id = new_guid()
        source_uuid = new_uid()
        gif_path = os.path.join(ELEMENTS_DIR, item['file']).replace('\\', '/')
        item_dur = to_units(item['duration_sec'])
        media_id_by_filename[item['file']] = (media_id, source_uuid, gif_path)

        # Create Medias/{media_id}/media.json
        m_dir = os.path.join(medias_folder, media_id)
        os.makedirs(m_dir, exist_ok=True)
        if os.path.exists(dump_thumb):
            shutil.copy2(dump_thumb, os.path.join(m_dir, 'thumbnail.png'))

        m_json = {
            "version": "1.1.7",
            "file_name": gif_path,
            "sourceInfo": {
                "basicInfo": {
                    "streamType": 2,
                    "fourCC": 6711655,
                    "mediaLength": item_dur,
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
                        "streamLength": item_dur,
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
        with open(os.path.join(m_dir, 'media.json'), 'w', encoding='utf-8') as f:
            json.dump(m_json, f)

        medias_info['media_items'][media_id] = {
            "download_url": gif_path,
            "id": media_id,
            "media_type": 2,
            "media_length": item_dur,
            "name": os.path.splitext(item['file'])[0],
            "mediaCreationInfo": '{"creationType":0}',
            "import_time": now_ts,
            "src_md5": "d41d8cd98f00b204e9800998ecf8427e",
            "stream_idx": -1,
            "mark_info_list": [{"mark_in": -1, "mark_out": -1}],
            "scence_info": []
        }
        media_structure_items.append(media_id)

        resources.append({
            "AIGCMeta": {"data": "", "size": 0},
            "alphaPremultiply": 0,
            "audioStreamCount": 0,
            "bitRate": 1000000,
            "createDate": now_ts,
            "filename": f"file:/{gif_path}",
            "fourCC": 6711655,
            "mediaLength": item_dur,
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
                    "streamLength": item_dur,
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

    # 4. Construct Video Tracks for active timeline elements
    for t_idx, item in enumerate(timeline_clips_spec):
        media_id, source_uuid, gif_path = media_id_by_filename[item['file']]
        clip_guid = new_guid()
        clip_uid = new_uid()
        media_clips_map[clip_guid] = {"mediaId": media_id, "subClips": {}}

        start_u = to_units(item['start_sec'])
        dur_u = to_units(item['duration_sec'])
        end_u = start_u + dur_u

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
                            "thisUId": new_uid(),
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
                            "thisUId": new_uid(),
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
            "filename": f"file:/{gif_path}",
            "image_denoise": {"cache_mode": 0, "sigma": 20, "status": 0, "version": 1},
            "inPoint": 0,
            "outPoint": dur_u,
            "picSequence": False,
            "pipBuf": '{"Algorithm":"Bilinear","BlendMode":0,"BlenderName":"video/blender/simple-pip","Enable":true,"Opacity":100.0}',
            "pipBufSize": 110,
            "placeholder": False,
            "placeholderStatus": 0,
            "sourceUuid": source_uuid,
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
            "tlBegin": start_u,
            "tlEnd": end_u,
            "type": 1,
            "userData": [
                {"data": "AAAAAA==", "key": 102, "size": 4},
                {"data": "AgAAAA==", "key": 103, "size": 4},
                {"data": "AwAAAA==", "key": 1, "size": 4},
                {"data": b64_str(item['name']), "key": 50, "size": len(item['name'])},
                {"data": "AAAAAA==", "key": 2, "size": 4},
                {"data": b64_str(media_id), "key": 10, "size": 38},
                {"data": b64_guid_padded(clip_guid), "key": 3, "size": 64},
                {"data": "BQAAAA==", "key": 6, "size": 4}
            ]
        }

        track_infos.append({
            "clipList": [clip_obj],
            "trackTag": t_idx + 1,
            "trackType": 1,
            "userData": [
                {"data": "AQAAAA==", "key": 21, "size": 4},
                {"data": "RgAAAA==", "key": 12000, "size": 4}
            ],
            "uuid": new_uid()
        })

    # Save updated medias_info.json
    medias_info['media_structure']['Folder']['media_item'] = media_structure_items
    with open(medias_info_file, 'w', encoding='utf-8') as f:
        json.dump(medias_info, f)

    # Save updated timeline.wesproj
    timeline_wesproj['resources'] = resources
    tl_info['trackInfos'] = track_infos
    with open(tl_file, 'w', encoding='utf-8') as f:
        json.dump(timeline_wesproj, f)

    # Save updated extra.json
    extra_file = os.path.join(tl_folder, 'extra.json')
    with open(extra_file, 'r', encoding='utf-8') as f:
        extra_json = json.load(f)
    extra_json['mediaClipsMapInfo'] = media_clips_map
    with open(extra_file, 'w', encoding='utf-8') as f:
        json.dump(extra_json, f)

    # 5. Pack into .wfp ZIP
    if os.path.exists(output_path):
        os.remove(output_path)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for root, dirs, files in os.walk(stage_dir):
            for file in files:
                f_path = os.path.join(root, file)
                rel = os.path.relpath(f_path, stage_dir).replace('\\', '/')
                z_out.write(f_path, rel)

    shutil.rmtree(stage_dir)
    print(f"[OK] Generated Filmora 15.5 project directly from native dump:")
    print(f"     Path: {output_path}")
    print(f"     Size: {os.path.getsize(output_path):,} bytes")

if __name__ == '__main__':
    target = os.path.join(BASE_DIR, 'nolan_prestige_motion_graphics.wfp')
    build_project(target)

    # Copy to elements/ and root E:/The Special Content/
    shutil.copy2(target, os.path.join(ELEMENTS_DIR, 'nolan_prestige_motion_graphics.wfp'))
    shutil.copy2(target, os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), 'nolan_prestige_motion_graphics.wfp'))
    print(f"[OK] Copied project to elements/ and workspace root.")
